import os
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, render_template, request

load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/terms_conditions')
def terms_conditions():
    return render_template('legal/terms_conditions.html')

@app.route('/privacy_policy')
def privacy_policy():
    return render_template('legal/privacy_policy.html')

@app.route('/refund_policy')
def refund_policy():
    return render_template('legal/refund_policy.html')

if __name__ == '__main__':
    if os.getenv('FLASK_ENV') == 'production':
        # For production deployment on Replit
        app.run(host='0.0.0.0', port=5000, debug=False)
    else:
        # For local development
        app.run(debug=True)