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

   # Activate virtual environment
   # For Windows:
   venv\Scripts\activate
   # For macOS/Linux:
   source venv/bin/activate
   ```

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
   - Configure SSL certificates for HTTPS
   - Set up reverse proxy (e.g., Nginx)

3. **Start Application**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

### Troubleshooting

- If you encounter permission errors, ensure proper file permissions
- For database connection issues, verify environment variables
- Check logs in case of server startup problems
