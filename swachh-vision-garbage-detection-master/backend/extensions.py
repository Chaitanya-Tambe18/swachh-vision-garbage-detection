"""
Flask extensions initialization
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from celery import Celery

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

# Celery configuration
def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)
    
    class ContextTask(celery.Task):
        """Make celery tasks work with Flask app context."""
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
    
    celery.Task = ContextTask
    return celery

# Placeholder for background task - removed for now
# Can be added later when Celery is properly configured
