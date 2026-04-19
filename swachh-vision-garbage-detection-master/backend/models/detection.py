"""
Detection model for storing garbage detection results
"""

from datetime import datetime
from extensions import db
from sqlalchemy import Index, JSON

class Detection(db.Model):
    """Detection model for storing garbage detection results"""
    
    __tablename__ = 'detections'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # File information
    file_path = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.String(10), nullable=False)  # image, video
    original_filename = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer)  # in bytes
    
    # Detection results
    result_json = db.Column(JSON)  # Store detection results as JSON
    garbage_count = db.Column(db.Integer, default=0)
    cleanliness_level = db.Column(db.String(10), default='LOW')  # LOW, MEDIUM, HIGH
    confidence_score = db.Column(db.Float, default=0.0)
    
    # Processing information
    processed_file_path = db.Column(db.String(500))  # Path to processed video/image
    processing_time = db.Column(db.Float)  # Processing time in seconds
    status = db.Column(db.String(20), default='pending')  # pending, processing, completed, failed
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    alerts = db.relationship('Alert', backref='detection', lazy=True, cascade='all, delete-orphan')
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_detection_status', 'status'),
        Index('idx_detection_created_at', 'created_at'),
        Index('idx_detection_cleanliness', 'cleanliness_level'),
        Index('idx_detection_file_type', 'file_type'),
    )
    
    def to_dict(self):
        """Convert detection to dictionary"""
        return {
            'id': self.id,
            'file_path': self.file_path,
            'file_type': self.file_type,
            'original_filename': self.original_filename,
            'file_size': self.file_size,
            'result_json': self.result_json,
            'garbage_count': self.garbage_count,
            'cleanliness_level': self.cleanliness_level,
            'confidence_score': self.confidence_score,
            'processed_file_path': self.processed_file_path,
            'processing_time': self.processing_time,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Detection {self.id}: {self.file_type} - {self.cleanliness_level}>'
