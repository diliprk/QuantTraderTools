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

@app.route('/order-summary')
def order_summary():
    subscription_type = request.args.get('subscription_type')
    license_key = request.args.get('license_key')
    currency = request.args.get('currency')
    amount = request.args.get('amount')
    plan_name = request.args.get('plan_name')
    product_type = request.args.get('product_type')
    
    timestamp = datetime.now().strftime('%d%m%Y%H%M')
    
    if product_type == 'telegram':
        type_prefix = 'TELEGRAM'
    elif product_type == 'discord':
        type_prefix = 'DISCORD'
    else:
        type_prefix = 'COMBO'
    
    order_id = f"QCMT5-{type_prefix}-{timestamp}"
    
    return render_template('order-summary.html',
                         subscription_type=subscription_type,
                         license_key=license_key,
                         currency=currency,
                         amount=amount,
                         plan_name=plan_name,
                         product_type=product_type,
                         order_id=order_id,
                         telegram_bot_token=os.getenv('QC_TELEGRAM_BOT_TOKEN'),
                         telegram_chat_id=os.getenv('QC_TELEGRAM_CHAT_ID'))

@app.route('/payment-acknowledgment', methods=['GET', 'POST'])
def payment_acknowledgment():
    return render_template('payment-acknowledgment.html')

if __name__ == '__main__':
    if os.getenv('FLASK_ENV') == 'production':
        # For production deployment on Replit
        app.run(host='0.0.0.0', port=5000, debug=False)
    else:
        # For local development
        app.run(debug=True)