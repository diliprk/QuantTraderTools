# QuantTraderTools Website

A Flask-based website for QuantTraderTools, featuring QuantCopier - an automated trading signal execution platform that works with both Telegram and Discord signals.

## Overview

QuantTraderTools is a platform designed for traders, offering automated signal copying capabilities through the QuantCopier software. The website serves as the main landing page and portal for users to learn about and purchase the QuantCopier service.

## Features

- Ease of Setup
- Advanced Signal Parsing
- Multiple Take Profits Support
- Signal Modifications
- Entry Randomization
- Real-time Telegram Alerts

## Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **CSS Framework**: Bootstrap 5
- **Payment Processing**: Custom payment handler

## How to Run

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Git

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/QuantTraderTools.git
   cd QuantTraderTools
   ```

2. **Set Up Virtual Environment**
   ```bash
   # Create virtual environment
   python -m venv venv

   # For macOS/Linux:
   source venv/bin/activate
   ```
if `venv` is not found, install it first run `sudo apt install python3.12-venv` on the machine


3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   ```bash
   # Create .env file from example
   cp .env.example .env

   # Edit .env file with your configuration:
   # - QC_TELEGRAM_BOT_TOKEN
   # - QC_TELEGRAM_CHAT_ID
   # - Other required environment variables
   ```

5. **Run Development Server**
   ```bash
   # Start Flask development server
   python app.py
   # The site will be available at http://localhost:5000
   ```

### Production Deployment

1. **Set Production Environment**
   ```bash
   export FLASK_ENV=production
   ```

2. **Configure Web Server**
   - Set up a production-grade web server (e.g., Gunicorn)
   - Set up reverse proxy (e.g., Nginx)

3. **Configure Firewall**
   ```bash
   # Allow HTTP traffic
   sudo ufw allow 80
   ```

4. **Install and Configure Nginx**
   ```bash
   # Install Nginx
   sudo apt install nginx

   # Create Nginx configuration
   sudo nano /etc/nginx/sites-available/quanttradertools
   ```
   
   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name _;  # Catch all incoming requests

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

5. **Enable the Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/quanttradertools /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default  # Remove default site
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Start Application with Gunicorn**
   ```bash
   # Install Gunicorn if not already installed
   pip install gunicorn

   # Start Gunicorn (for testing)
   gunicorn -w 4 -b 127.0.0.1:5000 app:app

   # To keep it running after closing terminal, use:
   nohup gunicorn -w 4 -b 127.0.0.1:5000 app:app &
   ```
   To run `nohup` commands for python, follow the below steps:
```bash
   cd ~/QuantTraderTools
   nohup venv/bin/python app.py > app.log 2>&1 &
```

### Important Notes

- Your site will be accessible via your server's public IP address (e.g., http://your.public.ip)
- Find your public IP address using `curl ipinfo.io/ip`
- This is a basic setup for testing. For production:
  - Add SSL/TLS certificates
  - Set up proper security headers
  - Use environment variables for sensitive data
  - Use a process manager (Supervisor/systemd) to keep the app running

### Troubleshooting

- If site isn't accessible, check:

  ```bash
  # Check if Nginx is running
  sudo systemctl status nginx
  
  # Check Nginx error logs
  sudo tail -f /var/log/nginx/error.log
  
  # Check if Gunicorn is running
  ps aux | grep gunicorn
  
  # Check Gunicorn output
  tail -f nohup.out
  ```
