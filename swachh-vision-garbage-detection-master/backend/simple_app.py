#!/usr/bin/env python3
"""
Simplified Swachh Vision Backend - No Database Required
For testing the enhanced frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from datetime import datetime
import base64
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

def allowed_file(filename, file_type):
    """Check if file is allowed"""
    if file_type == 'image':
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
    elif file_type == 'video':
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm']
    return False

@app.route('/api/health')
def health_check():
    return {'status': 'healthy', 'message': 'Swachh Vision API is running'}

@app.route('/')
def index():
    return {'message': 'Swachh Vision - AI Garbage Detection System API'}

@app.route('/api/detect/image', methods=['POST'])
def detect_image():
    """Detect garbage in uploaded image - Mock implementation"""
    try:
        # Check if file was uploaded
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Save uploaded file
        if allowed_file(file.filename, 'image'):
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            file.save(file_path)
            
            # Mock detection result
            result = {
                'id': uuid.uuid4(),
                'file_type': 'image',
                'original_filename': file.filename,
                'status': 'completed',
                'garbage_count': 3,
                'cleanliness_level': 'LOW',
                'confidence_score': 0.92,
                'processing_time': 1.2,
                'created_at': datetime.utcnow().isoformat(),
                'processed_file_path': None  # We'll add this later
            }
            
            return jsonify({
                'message': 'Image detection completed',
                'detection': result
            }), 200
        else:
            return jsonify({'error': 'Invalid image file type'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Image detection failed: {str(e)}'}), 500

@app.route('/api/detect/video', methods=['POST'])
def detect_video():
    """Detect garbage in uploaded video - Mock implementation"""
    try:
        # Check if file was uploaded
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        file = request.files['video']
        if file.filename == '':
            return jsonify({'error': 'No video file selected'}), 400
        
        # Save uploaded file
        if allowed_file(file.filename, 'video'):
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            file.save(file_path)
            
            # Mock detection result
            result = {
                'id': uuid.uuid4(),
                'file_type': 'video',
                'original_filename': file.filename,
                'status': 'completed',
                'garbage_count': 5,
                'cleanliness_level': 'MEDIUM',
                'confidence_score': 0.85,
                'processing_time': 2.5,
                'created_at': datetime.utcnow().isoformat()
            }
            
            return jsonify({
                'message': 'Video detection completed',
                'detection': result
            }), 200
        else:
            return jsonify({'error': 'Invalid video file type'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Video detection failed: {str(e)}'}), 500

@app.route('/api/detect/live', methods=['POST'])
def start_live_detection():
    """Start live webcam detection - Mock implementation"""
    try:
        return jsonify({
            'message': 'Live detection configuration',
            'config': {
                'confidence_threshold': 0.5,
                'iou_threshold': 0.4,
                'device': 'cpu'
            },
            'instructions': {
                'step1': 'Access webcam using getUserMedia()',
                'step2': 'Capture frames and send to /api/detect/frame endpoint',
                'step3': 'Display results with bounding boxes'
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Live detection setup failed: {str(e)}'}), 500

@app.route('/api/detect/frame', methods=['POST'])
def detect_frame():
    """Detect garbage in a single frame - Mock implementation"""
    try:
        # Check if frame data was uploaded
        if 'frame' not in request.files:
            return jsonify({'error': 'No frame data provided'}), 400
        
        file = request.files['frame']
        if file.filename == '':
            return jsonify({'error': 'No frame data selected'}), 400
        
        # Save temporary frame
        temp_path = os.path.join(UPLOAD_FOLDER, f"temp_frame_{uuid.uuid4()}.jpg")
        file.save(temp_path)
        
        # Mock frame detection
        result = {
            'garbage_count': 2,
            'cleanliness_level': 'LOW',
            'confidence_score': 0.88,
            'processing_time': 0.5
        }
        
        # Clean up temporary file
        try:
            os.remove(temp_path)
        except:
            pass
        
        return jsonify({
            'success': True,
            'result': result
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Frame detection failed: {str(e)}'}), 500

@app.route('/api/detect/detections', methods=['GET'])
def get_detections():
    """Get detection history - Mock implementation"""
    try:
        # Mock detection history
        detections = [
            {
                'id': '1',
                'file_type': 'image',
                'original_filename': 'sample1.jpg',
                'status': 'completed',
                'garbage_count': 3,
                'cleanliness_level': 'LOW',
                'confidence_score': 0.92,
                'created_at': datetime.utcnow().isoformat()
            },
            {
                'id': '2',
                'file_type': 'video',
                'original_filename': 'sample2.mp4',
                'status': 'completed',
                'garbage_count': 5,
                'cleanliness_level': 'MEDIUM',
                'confidence_score': 0.85,
                'created_at': datetime.utcnow().isoformat()
            }
        ]
        
        return jsonify({
            'detections': detections,
            'pagination': {
                'page': 1,
                'per_page': 20,
                'total': len(detections),
                'pages': 1,
                'has_next': False,
                'has_prev': False
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get detections: {str(e)}'}), 500

# Mock Dashboard APIs
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics - Mock implementation"""
    try:
        stats = {
            'total_detections': 156,
            'total_garbage_detected': 89,
            'sent_alerts': 12,
            'average_confidence': 0.87,
            'cleanliness_distribution': [
                {'level': 'LOW', 'count': 89, 'percentage': 57.1},
                {'level': 'MEDIUM', 'count': 45, 'percentage': 28.8},
                {'level': 'HIGH', 'count': 22, 'percentage': 14.1}
            ]
        }
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get stats: {str(e)}'}), 500

@app.route('/api/dashboard/timeline', methods=['GET'])
def get_dashboard_timeline():
    """Get timeline data - Mock implementation"""
    try:
        timeline = [
            {'date': '2024-01-01', 'detections': 12, 'garbage_count': 8},
            {'date': '2024-01-02', 'detections': 15, 'garbage_count': 11},
            {'date': '2024-01-03', 'detections': 8, 'garbage_count': 5},
            {'date': '2024-01-04', 'detections': 18, 'garbage_count': 14},
            {'date': '2024-01-05', 'detections': 22, 'garbage_count': 19},
        ]
        return jsonify({'timeline': timeline}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get timeline: {str(e)}'}), 500

@app.route('/api/dashboard/heatmap', methods=['GET'])
def get_dashboard_heatmap():
    """Get heatmap data - Mock implementation"""
    try:
        heatmap = {
            'hourly_pattern': [
                {'hour': '00:00', 'detections': 2},
                {'hour': '06:00', 'detections': 8},
                {'hour': '12:00', 'detections': 15},
                {'hour': '18:00', 'detections': 12},
                {'hour': '23:00', 'detections': 3},
            ],
            'weekly_pattern': [
                {'day_name': 'Monday', 'detections': 25},
                {'day_name': 'Tuesday', 'detections': 30},
                {'day_name': 'Wednesday', 'detections': 28},
                {'day_name': 'Thursday', 'detections': 35},
                {'day_name': 'Friday', 'detections': 32},
                {'day_name': 'Saturday', 'detections': 18},
                {'day_name': 'Sunday', 'detections': 15},
            ]
        }
        return jsonify(heatmap), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get heatmap: {str(e)}'}), 500

@app.route('/api/dashboard/garbage-types', methods=['GET'])
def get_dashboard_garbage_types():
    """Get garbage type statistics - Mock implementation"""
    try:
        garbage_types = [
            {'type': 'Plastic Bottles', 'count': 45, 'percentage': 35.2},
            {'type': 'Paper Waste', 'count': 32, 'percentage': 25.0},
            {'type': 'Food Containers', 'count': 28, 'percentage': 21.9},
            {'type': 'Glass', 'count': 15, 'percentage': 11.7},
            {'type': 'Metal Cans', 'count': 8, 'percentage': 6.2},
        ]
        return jsonify({'garbage_types': garbage_types}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get garbage types: {str(e)}'}), 500

# Mock Alerts APIs
@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get alerts - Mock implementation"""
    try:
        alerts = [
            {
                'id': '1',
                'alert_type': 'email',
                'recipient': 'admin@swachhvision.com',
                'subject': 'High Garbage Level Detected',
                'message': 'High level of garbage detected in area A',
                'created_at': datetime.utcnow().isoformat(),
                'email_sent': True,
                'sent_at': datetime.utcnow().isoformat()
            }
        ]
        return jsonify({'alerts': alerts}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get alerts: {str(e)}'}), 500

if __name__ == '__main__':
    print("🚀 Starting Swachh Vision Backend Server...")
    print("📊 API Endpoints available:")
    print("   • GET  /api/health")
    print("   • POST /api/detect/image")
    print("   • POST /api/detect/video") 
    print("   • POST /api/detect/live")
    print("   • POST /api/detect/frame")
    print("   • GET  /api/dashboard/stats")
    print("   • GET  /api/dashboard/timeline")
    print("   • GET  /api/dashboard/heatmap")
    print("   • GET  /api/dashboard/garbage-types")
    print("   • GET  /api/alerts")
    print("\n🌐 Server running on: http://localhost:5000")
    print("🇮🇳 Swachh Vision - AI Garbage Detection System")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
