"""
Email Service for Swachh Vision Alerts
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from datetime import datetime
from typing import Optional, List
from config import Config

class EmailService:
    """Email service for sending alerts"""
    
    def __init__(self):
        """Initialize email service"""
        self.smtp_server = Config.MAIL_SERVER
        self.smtp_port = Config.MAIL_PORT
        self.use_tls = Config.MAIL_USE_TLS
        self.username = Config.MAIL_USERNAME
        self.password = Config.MAIL_PASSWORD
        self.default_sender = Config.MAIL_DEFAULT_SENDER
    
    def send_garbage_alert(self, 
                          recipient_email: str,
                          cleanliness_level: str,
                          garbage_count: int,
                          detection_info: dict,
                          alert_image_path: Optional[str] = None) -> bool:
        """Send garbage detection alert email"""
        
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.default_sender
            msg['To'] = recipient_email
            msg['Subject'] = f"🚨 Swachh Vision Alert: {cleanliness_level} Garbage Level Detected"
            
            # Create HTML body
            html_body = self._create_alert_html(cleanliness_level, garbage_count, detection_info)
            msg.attach(MIMEText(html_body, 'html'))
            
            # Attach alert image if provided
            if alert_image_path and os.path.exists(alert_image_path):
                with open(alert_image_path, 'rb') as f:
                    img_data = f.read()
                image = MIMEImage(img_data)
                image.add_header('Content-Disposition', f'attachment; filename=alert_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jpg')
                msg.attach(image)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()
                if self.username and self.password:
                    server.login(self.username, self.password)
                server.send_message(msg)
            
            return True
            
        except Exception as e:
            print(f"❌ Email sending failed: {e}")
            return False
    
    def _create_alert_html(self, cleanliness_level: str, garbage_count: int, detection_info: dict) -> str:
        """Create HTML email body for alert"""
        
        # Color coding based on cleanliness level
        colors = {
            'LOW': '#28a745',    # Green
            'MEDIUM': '#ffc107',  # Yellow
            'HIGH': '#dc3545'     # Red
        }
        
        alert_color = colors.get(cleanliness_level, '#6c757d')
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Swachh Vision Alert</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #FF9933, #138808);
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #f8f9fa;
                    padding: 30px;
                    border: 1px solid #dee2e6;
                    border-top: none;
                }}
                .alert-box {{
                    background: {alert_color};
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: center;
                }}
                .stats {{
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin: 20px 0;
                }}
                .stat-item {{
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }}
                .stat-value {{
                    font-size: 2em;
                    font-weight: bold;
                    color: {alert_color};
                }}
                .footer {{
                    background: #343a40;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 0 0 10px 10px;
                    font-size: 0.9em;
                }}
                .logo {{
                    font-size: 1.5em;
                    font-weight: bold;
                }}
                .btn {{
                    display: inline-block;
                    padding: 12px 24px;
                    background: #138808;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 10px 0;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">🧹 Swachh Vision</div>
                <h1>AI Garbage Detection Alert</h1>
            </div>
            
            <div class="content">
                <div class="alert-box">
                    <h2>🚨 {cleanliness_level} GARBAGE LEVEL DETECTED</h2>
                    <p>Immediate attention may be required</p>
                </div>
                
                <h3>Detection Summary</h3>
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-value">{garbage_count}</div>
                        <div>Garbage Objects</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{cleanliness_level}</div>
                        <div>Cleanliness Level</div>
                    </div>
                </div>
                
                <h3>Detection Details</h3>
                <ul>
                    <li><strong>Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</li>
                    <li><strong>File Type:</strong> {detection_info.get('file_type', 'Unknown')}</li>
                    <li><strong>Confidence:</strong> {detection_info.get('confidence_score', 0):.2f}</li>
                    <li><strong>Processing Time:</strong> {detection_info.get('processing_time', 0):.2f} seconds</li>
                </ul>
                
                {f'<h3>Detected Objects:</h3><ul>' + ''.join([f"<li>{d.get('class', 'Unknown')} (Confidence: {d.get('confidence', 0):.2f})</li>" for d in detection_info.get('detections', [])[:5]]) + '</ul>' if detection_info.get('detections') else ''}
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" class="btn">View Dashboard</a>
                </div>
                
                <p><strong>Recommended Action:</strong></p>
                <p>
                    {self._get_recommended_action(cleanliness_level, garbage_count)}
                </p>
            </div>
            
            <div class="footer">
                <p>🧹 Swachh Vision - AI Garbage Detection System</p>
                <p>Making India cleaner with AI technology</p>
                <p><small>This is an automated alert. Please do not reply to this email.</small></p>
            </div>
        </body>
        </html>
        """
        
        return html
    
    def _get_recommended_action(self, cleanliness_level: str, garbage_count: int) -> str:
        """Get recommended action based on cleanliness level"""
        
        actions = {
            'LOW': "The area appears to be clean. Continue monitoring for any changes.",
            'MEDIUM': "Some garbage has been detected. Consider scheduling cleaning within the next 24 hours.",
            'HIGH': "High garbage level detected! Immediate cleaning action is recommended to maintain hygiene standards."
        }
        
        return actions.get(cleanliness_level, "Please review the detection results and take appropriate action.")
    
    def send_welcome_email(self, recipient_email: str, user_name: str) -> bool:
        """Send welcome email to new users"""
        
        try:
            msg = MIMEMultipart()
            msg['From'] = self.default_sender
            msg['To'] = recipient_email
            msg['Subject'] = "Welcome to Swachh Vision - AI Garbage Detection System"
            
            html_body = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Swachh Vision</title>
                <style>
                    body {{
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    .header {{
                        background: linear-gradient(135deg, #FF9933, #138808);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }}
                    .content {{
                        background: #f8f9fa;
                        padding: 30px;
                        border: 1px solid #dee2e6;
                        border-top: none;
                    }}
                    .footer {{
                        background: #343a40;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 0 0 10px 10px;
                    }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🧹 Welcome to Swachh Vision!</h1>
                    <p>AI Garbage Detection System</p>
                </div>
                
                <div class="content">
                    <h2>Hello {user_name}!</h2>
                    <p>Welcome to Swachh Vision, your AI-powered garbage detection system. We're excited to help you maintain cleaner environments through advanced computer vision technology.</p>
                    
                    <h3>What You Can Do:</h3>
                    <ul>
                        <li>📤 Upload images or videos for garbage detection</li>
                        <li>📹 Use live webcam detection</li>
                        <li>📊 View analytics and dashboard</li>
                        <li>🚨 Receive email alerts for high garbage levels</li>
                    </ul>
                    
                    <p>Get started by uploading your first image or video for detection!</p>
                </div>
                
                <div class="footer">
                    <p>🧹 Swachh Vision - Making India cleaner with AI</p>
                </div>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(html_body, 'html'))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()
                if self.username and self.password:
                    server.login(self.username, self.password)
                server.send_message(msg)
            
            return True
            
        except Exception as e:
            print(f"❌ Welcome email failed: {e}")
            return False
