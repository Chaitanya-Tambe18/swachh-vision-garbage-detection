"""
Alert model for storing garbage detection alerts
"""

from datetime import datetime
from extensions import db
from sqlalchemy import Index

class Alert(db.Model):
    """Alert model for storing garbage detection alerts"""
    
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    detection_id = db.Column(db.Integer, db.ForeignKey('detections.id'), nullable=False)
    
    # Alert information
    alert_type = db.Column(db.String(20), default='email')  # email, sms, push
    recipient = db.Column(db.String(255))  # Email address or phone number
    subject = db.Column(db.String(255))
    message = db.Column(db.Text)
    
    # Alert status
    email_sent = db.Column(db.Boolean, default=False)
    sent_at = db.Column(db.DateTime)
    error_message = db.Column(db.Text)  # Store error if sending failed
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_alert_detection', 'detection_id'),
        Index('idx_alert_sent', 'email_sent'),
        Index('idx_alert_created_at', 'created_at'),
    )
    
    def mark_as_sent(self):
        """Mark alert as sent"""
        self.email_sent = True
        self.sent_at = datetime.utcnow()
        db.session.commit()
    
    def mark_as_failed(self, error_message):
        """Mark alert as failed"""
        self.email_sent = False
        self.error_message = error_message
        db.session.commit()
    
    def to_dict(self):
        """Convert alert to dictionary"""
        return {
            'id': self.id,
            'detection_id': self.detection_id,
            'alert_type': self.alert_type,
            'recipient': self.recipient,
            'subject': self.subject,
            'message': self.message,
            'email_sent': self.email_sent,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Alert {self.id}: {self.alert_type} - {"Sent" if self.email_sent else "Pending"}>'
