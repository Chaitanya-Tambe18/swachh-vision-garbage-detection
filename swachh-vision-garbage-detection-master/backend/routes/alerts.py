"""
Alerts routes for Swachh Vision - No Authentication Required
"""

from flask import Blueprint, request, jsonify
from models.alert import Alert
from models.detection import Detection
from extensions import db
from services.email_service import EmailService
from datetime import datetime, timedelta

alerts_bp = Blueprint('alerts', __name__)

@alerts_bp.route('/', methods=['GET'])
def get_alerts():
    """Get all alerts - No authentication required"""
    try:
        # Return empty alerts for now
        return jsonify({
            'alerts': [],
            'pagination': {
                'page': 1,
                'per_page': 20,
                'total': 0,
                'pages': 0,
                'has_next': False,
                'has_prev': False
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get alerts: {str(e)}'}), 500

@alerts_bp.route('/<int:alert_id>', methods=['GET'])
def get_alert(alert_id):
    """Get specific alert details - No authentication required"""
    try:
        alert = Alert.query.join(Detection).filter(
            Alert.id == alert_id
        ).first()
        
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        return jsonify({
            'alert': alert.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get alert: {str(e)}'}), 500

@alerts_bp.route('/<int:alert_id>', methods=['DELETE'])
def delete_alert(alert_id):
    """Delete an alert - No authentication required"""
    try:
        alert = Alert.query.join(Detection).filter(
            Alert.id == alert_id
        ).first()
        
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        db.session.delete(alert)
        db.session.commit()
        
        return jsonify({
            'message': 'Alert deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete alert: {str(e)}'}), 500

@alerts_bp.route('/clear', methods=['DELETE'])
def clear_alerts():
    """Clear all alerts or alerts matching filters - No authentication required"""
    try:
        # Filter parameters
        alert_type = request.args.get('alert_type')
        email_sent = request.args.get('email_sent')
        older_than = request.args.get('older_than')  # days
        
        # Build query (no user filter)
        query = Alert.query
        
        if alert_type:
            query = query.filter(Alert.alert_type == alert_type)
        
        if email_sent is not None:
            sent_filter = email_sent.lower() == 'true'
            query = query.filter(Alert.email_sent == sent_filter)
        
        if older_than:
            try:
                days = int(older_than)
                cutoff_date = datetime.utcnow() - timedelta(days=days)
                query = query.filter(Alert.created_at < cutoff_date)
            except ValueError:
                return jsonify({'error': 'Invalid older_than parameter'}), 400
        
        # Get count before deletion
        count = query.count()
        
        # Delete alerts
        query.delete()
        db.session.commit()
        
        return jsonify({
            'message': f'{count} alerts deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to clear alerts: {str(e)}'}), 500

@alerts_bp.route('/stats', methods=['GET'])
def get_alert_stats():
    """Get alert statistics - No authentication required"""
    try:
        # Return empty alert stats for now
        return jsonify({
            'period_days': 30,
            'total_alerts': 0,
            'sent_alerts': 0,
            'failed_alerts': 0,
            'success_rate': 0,
            'alerts_by_type': [],
            'recent_alerts': []
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get alert stats: {str(e)}'}), 500

@alerts_bp.route('/test', methods=['POST'])
def test_email_alert():
    """Send a test email alert - No authentication required"""
    try:
        # Create test detection info
        test_detection_info = {
            'file_type': 'image',
            'confidence_score': 0.95,
            'processing_time': 2.5,
            'detections': [
                {'class': 'bottle', 'confidence': 0.95},
                {'class': 'plastic', 'confidence': 0.87}
            ]
        }
        
        # Send test email
        email_service = EmailService()
        success = email_service.send_garbage_alert(
            recipient_email='admin@swachhvision.com',
            cleanliness_level='HIGH',
            garbage_count=5,
            detection_info=test_detection_info,
            alert_image_path=None
        )
        
        if success:
            return jsonify({
                'message': 'Test email sent successfully'
            }), 200
        else:
            return jsonify({
                'error': 'Failed to send test email'
            }), 500
        
    except Exception as e:
        return jsonify({'error': f'Test email failed: {str(e)}'}), 500

@alerts_bp.route('/settings', methods=['GET'])
def get_alert_settings():
    """Get alert settings (placeholder for future implementation) - No authentication required"""
    try:
        # For now, return default settings
        # In future, this could be stored in database per user
        settings = {
            'email_alerts': True,
            'alert_threshold': 'HIGH',  # LOW, MEDIUM, HIGH
            'alert_cooldown': 300,  # seconds
            'notification_types': ['email']
        }
        
        return jsonify({
            'settings': settings
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get alert settings: {str(e)}'}), 500

@alerts_bp.route('/settings', methods=['PUT'])
def update_alert_settings():
    """Update alert settings (placeholder for future implementation) - No authentication required"""
    try:
        data = request.get_json()
        
        # Validate settings
        valid_thresholds = ['LOW', 'MEDIUM', 'HIGH']
        alert_threshold = data.get('alert_threshold', 'HIGH')
        
        if alert_threshold not in valid_thresholds:
            return jsonify({'error': f'Invalid alert_threshold. Must be one of: {valid_thresholds}'}), 400
        
        # For now, just return success
        # In future, this would be saved to database
        settings = {
            'email_alerts': data.get('email_alerts', True),
            'alert_threshold': alert_threshold,
            'alert_cooldown': data.get('alert_cooldown', 300),
            'notification_types': data.get('notification_types', ['email'])
        }
        
        return jsonify({
            'message': 'Alert settings updated successfully',
            'settings': settings
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to update alert settings: {str(e)}'}), 500
