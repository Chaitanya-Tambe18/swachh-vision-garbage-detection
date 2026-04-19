"""
ML Service Integration for Swachh Vision
Integrates with existing garbage_detection module
"""

import os
import sys
import time
import cv2
import numpy as np
import torch
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from config import Config
import json

# Add garbage_detection to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'garbage_detection'))

class MLService:
    """ML Service wrapper for garbage detection"""
    
    def __init__(self):
        """Initialize ML service"""
        self.base_dir = Path(__file__).parent.parent.parent
        self.garbage_detection_dir = self.base_dir / 'garbage_detection'
        self.model_path = Config.MODEL_PATH
        
        # Fallback to yolov8n.pt if custom model not found
        if not os.path.exists(self.model_path):
            self.model_path = self.garbage_detection_dir / 'yolov8n.pt'
        
        # Detection parameters
        self.confidence_threshold = Config.CONFIDENCE_THRESHOLD
        self.iou_threshold = Config.IOU_THRESHOLD
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Cleanliness thresholds
        self.cleanliness_thresholds = Config.CLEANLINESS_THRESHOLDS
        
        # Model initialization
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load YOLO model"""
        try:
            from ultralytics import YOLO
            
            print(f"🤖 Loading model: {self.model_path}")
            self.model = YOLO(str(self.model_path))
            self.model.to(self.device)
            
            # Enable FP16 for GPU
            if self.device == "cuda":
                self.model.fuse()
            
            print(f"✅ Model loaded successfully on {self.device}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to load model: {e}")
            return False
    
    def classify_cleanliness(self, garbage_count: int) -> Tuple[str, Tuple[int, int, int]]:
        """Classify cleanliness level based on garbage count"""
        if garbage_count == 0:
            return "LOW", (0, 255, 0)  # Green
        elif garbage_count <= self.cleanliness_thresholds["medium"]:
            return "MEDIUM", (0, 255, 255)  # Yellow
        else:
            return "HIGH", (0, 0, 255)  # Red
    
    def process_detection_results(self, results, use_pretrained: bool = False) -> Dict:
        """Process YOLO detection results"""
        garbage_count = 0
        detections = []
        
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Get coordinates and confidence
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = float(box.conf[0].cpu().numpy())
                    class_id = int(box.cls[0].cpu().numpy())
                    
                    if use_pretrained:
                        # COCO class names - focus on garbage-related items
                        coco_classes = [
                            'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 
                            'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 
                            'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 
                            'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 
                            'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 
                            'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 
                            'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 
                            'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 
                            'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 
                            'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
                        ]
                        class_name = coco_classes[class_id] if class_id < len(coco_classes) else f"Unknown({class_id})"
                        
                        # Count ONLY garbage-related items
                        garbage_items = ['bottle', 'cup', 'wine glass', 'plastic', 'can', 'bag', 'trash', 'waste', 'container', 'debris', 'litter', 'paper', 'cardboard']
                        if class_name in garbage_items:
                            garbage_count += 1
                            detections.append({
                                'class': class_name,
                                'confidence': confidence,
                                'bbox': [float(x1), float(y1), float(x2), float(y2)]
                            })
                    else:
                        # Custom garbage classes
                        class_names = ['biodegradable', 'cardboard', 'glass', 'metal', 'paper', 'plastic']
                        class_name = class_names[class_id] if class_id < len(class_names) else f"Unknown({class_id})"
                        garbage_count += 1  # All custom classes are garbage
                        detections.append({
                            'class': class_name,
                            'confidence': confidence,
                            'bbox': [float(x1), float(y1), float(x2), float(y2)]
                        })
        
        return {
            'garbage_count': garbage_count,
            'detections': detections,
            'total_objects': len(detections)
        }
    
    def detect_image(self, image_path: str) -> Dict:
        """Detect garbage in an image"""
        if not self.model:
            return {'error': 'Model not loaded'}
        
        start_time = time.time()
        
        try:
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                return {'error': 'Could not read image'}
            
            # Run inference
            with torch.no_grad():
                results = self.model(
                    image, 
                    conf=self.confidence_threshold,
                    iou=self.iou_threshold,
                    half=(self.device == "cuda"),
                    verbose=False
                )
            
            # Process results
            detection_results = self.process_detection_results(results, use_pretrained=True)
            
            # Classify cleanliness
            cleanliness_level, color = self.classify_cleanliness(detection_results['garbage_count'])
            
            # Calculate processing time
            processing_time = time.time() - start_time
            
            # Draw detections on image (optional)
            processed_image_path = self._draw_detections_on_image(
                image, results, detection_results['garbage_count'], cleanliness_level, color, image_path
            )
            
            return {
                'success': True,
                'garbage_count': detection_results['garbage_count'],
                'cleanliness_level': cleanliness_level,
                'confidence_score': np.mean([d['confidence'] for d in detection_results['detections']]) if detection_results['detections'] else 0.0,
                'detections': detection_results['detections'],
                'processing_time': processing_time,
                'processed_image_path': processed_image_path,
                'image_size': image.shape[:2]
            }
            
        except Exception as e:
            return {'error': f'Detection failed: {str(e)}'}
    
    def detect_video(self, video_path: str) -> Dict:
        """Detect garbage in a video"""
        if not self.model:
            return {'error': 'Model not loaded'}
        
        start_time = time.time()
        
        try:
            # Initialize video capture
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                return {'error': 'Could not open video'}
            
            # Get video properties
            fps = cap.get(cv2.CAP_PROP_FPS)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            # Setup video writer
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_filename = f"processed_{timestamp}_{os.path.basename(video_path)}"
            output_path = os.path.join(Config.PROCESSED_FOLDER, output_filename)
            
            os.makedirs(Config.PROCESSED_FOLDER, exist_ok=True)
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            
            frame_count = 0
            total_garbage_count = 0
            all_detections = []
            
            # Process video frames
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Run inference every 5 frames for performance
                if frame_count % 5 == 0:
                    with torch.no_grad():
                        results = self.model(
                            frame,
                            conf=self.confidence_threshold,
                            iou=self.iou_threshold,
                            half=(self.device == "cuda"),
                            verbose=False
                        )
                    
                    # Process results
                    detection_results = self.process_detection_results(results, use_pretrained=True)
                    cleanliness_level, color = self.classify_cleanliness(detection_results['garbage_count'])
                    
                    # Draw detections
                    frame = self._draw_detections_on_frame(
                        frame, results, detection_results['garbage_count'], cleanliness_level, color
                    )
                    
                    total_garbage_count += detection_results['garbage_count']
                    all_detections.extend(detection_results['detections'])
                
                # Write frame
                out.write(frame)
                frame_count += 1
                
                # Progress update
                if frame_count % 100 == 0:
                    progress = (frame_count / total_frames) * 100
                    print(f"📊 Video processing: {progress:.1f}% ({frame_count}/{total_frames})")
            
            # Cleanup
            cap.release()
            out.release()
            
            # Calculate overall metrics
            processing_time = time.time() - start_time
            avg_confidence = np.mean([d['confidence'] for d in all_detections]) if all_detections else 0.0
            cleanliness_level, _ = self.classify_cleanliness(total_garbage_count)
            
            return {
                'success': True,
                'garbage_count': total_garbage_count,
                'cleanliness_level': cleanliness_level,
                'confidence_score': avg_confidence,
                'detections': all_detections[:100],  # Limit to first 100 detections
                'processing_time': processing_time,
                'processed_video_path': output_path,
                'video_info': {
                    'fps': fps,
                    'width': width,
                    'height': height,
                    'total_frames': total_frames,
                    'processed_frames': frame_count
                }
            }
            
        except Exception as e:
            return {'error': f'Video processing failed: {str(e)}'}
    
    def _draw_detections_on_image(self, image, results, garbage_count: int, cleanliness_level: str, color: Tuple, original_path: str) -> str:
        """Draw detections on image and save"""
        # Draw bounding boxes
        for result in results:
            if hasattr(result, 'boxes') and result.boxes is not None:
                for box in result.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = box.conf[0].cpu().numpy()
                    
                    # Draw rectangle
                    cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
                    
                    # Draw label
                    label = f"Garbage {confidence:.2f}"
                    cv2.putText(image, label, (int(x1), int(y1) - 10), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        # Draw cleanliness indicator
        level_text = f"Cleanliness: {cleanliness_level}"
        cv2.putText(image, level_text, (20, 40), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, color, 3)
        
        # Draw garbage count
        count_text = f"Garbage Count: {garbage_count}"
        cv2.putText(image, count_text, (20, 80), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Save processed image
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"processed_{timestamp}_{os.path.basename(original_path)}"
        output_path = os.path.join(Config.PROCESSED_FOLDER, filename)
        os.makedirs(Config.PROCESSED_FOLDER, exist_ok=True)
        cv2.imwrite(output_path, image)
        
        return output_path
    
    def _draw_detections_on_frame(self, frame, results, garbage_count: int, cleanliness_level: str, color: Tuple) -> np.ndarray:
        """Draw detections on video frame"""
        # Similar to _draw_detections_on_image but for video frames
        for result in results:
            if hasattr(result, 'boxes') and result.boxes is not None:
                for box in result.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = box.conf[0].cpu().numpy()
                    
                    # Draw rectangle
                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
                    
                    # Draw label
                    label = f"Garbage {confidence:.2f}"
                    cv2.putText(frame, label, (int(x1), int(y1) - 10), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        # Draw cleanliness indicator
        level_text = f"Cleanliness: {cleanliness_level}"
        cv2.putText(frame, level_text, (20, 40), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, color, 3)
        
        # Draw garbage count
        count_text = f"Garbage Count: {garbage_count}"
        cv2.putText(frame, count_text, (20, 80), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        return frame
