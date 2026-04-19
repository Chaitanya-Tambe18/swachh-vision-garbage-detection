"""
Dashboard routes for Swachh Vision - No Authentication Required
"""

from flask import Blueprint, request, jsonify
from models.detection import Detection
from models.alert import Alert
from extensions import db
from datetime import datetime, timedelta
import calendar

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics - No authentication required"""
    try:
        # Return simple test data first
        return jsonify({
            'period_days': 30,
            'total_detections': 0,
            'completed_detections': 0,
            'total_garbage_detected': 0,
            'average_confidence': 0.0,
            'cleanliness_distribution': [],
            'file_type_distribution': [],
            'total_alerts': 0,
            'sent_alerts': 0,
            'recent_detections': []
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get dashboard stats: {str(e)}'}), 500

@dashboard_bp.route('/timeline', methods=['GET'])
def get_detection_timeline():
    """Get detection timeline data - No authentication required"""
    try:
        # Return empty timeline data for now
        return jsonify({
            'period_days': 30,
            'granularity': 'daily',
            'timeline': []
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get timeline data: {str(e)}'}), 500

@dashboard_bp.route('/heatmap', methods=['GET'])
def get_detection_heatmap():
    """Get detection heatmap data - No authentication required"""
    try:
        # Return empty heatmap data for now
        return jsonify({
            'period_days': 30,
            'hourly_pattern': [{'hour': h, 'detections': 0} for h in range(24)],
            'weekly_pattern': [{'day_of_week': d, 'day_name': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][d], 'detections': 0} for d in range(7)]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get heatmap data: {str(e)}'}), 500

@dashboard_bp.route('/garbage-types', methods=['GET'])
def get_garbage_types_stats():
    """Get garbage type statistics - No authentication required"""
    try:
        # Return empty garbage types data for now
        return jsonify({
            'period_days': 30,
            'garbage_types': [],
            'total_objects': 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get garbage type stats: {str(e)}'}), 500

@dashboard_bp.route('/performance', methods=['GET'])
def get_performance_stats():
    """Get performance statistics - No authentication required"""
    try:
        # Return empty performance data for now
        return jsonify({
            'period_days': 30,
            'avg_processing_time': 0,
            'min_processing_time': 0,
            'max_processing_time': 0,
            'total_processed': 0,
            'processing_time_distribution': [
                {'range': '0-5s', 'count': 0},
                {'range': '5-10s', 'count': 0},
                {'range': '10-30s', 'count': 0},
                {'range': '30-60s', 'count': 0},
                {'range': '60s+', 'count': 0}
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get performance stats: {str(e)}'}), 500
