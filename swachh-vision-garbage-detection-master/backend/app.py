#!/usr/bin/env python3
"""
Swachh Vision - AI Garbage Detection System
Main Flask Application
"""

from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, migrate, make_celery
from routes.detection import detection_bp
from routes.alerts import alerts_bp
from routes.dashboard import dashboard_bp
import os

def create_app(config_class=Config):
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    
    # Initialize Celery
    celery = make_celery(app)
    
    # Register blueprints (no auth - open access)
    app.register_blueprint(detection_bp, url_prefix='/api/detect')
    app.register_blueprint(alerts_bp, url_prefix='/api/alerts')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    
    # Create upload directories
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Swachh Vision API is running'}
    
    @app.route('/')
    def index():
        return {'message': 'Swachh Vision - AI Garbage Detection System API'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
