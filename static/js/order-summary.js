const UPI_ID = "diliprajkumar@airtel";
const UPI_RECEIVER_NAME = "Dilip Rajkumar";

function initOrderSummary(telegramBotToken, telegramChatId) {
    document.getElementById('upiIdSpan').textContent = UPI_ID;
    
    // Add form input listeners
    const formInputs = document.querySelectorAll('input[type="text"], input[type="email"]');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    });

    // Email validation
    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
        emailInput.addEventListener('input', handleEmailValidation);
        emailInput.addEventListener('blur', function() {
            if (this.value) {
                this.classList.add('submitted');
            }
        });
    }
}

function handleEmailValidation() {
    const errorTooltip = this.nextElementSibling;
    
    if (this.validity.valid) {
        errorTooltip.style.visibility = 'hidden';
        errorTooltip.style.opacity = '0';
        this.style.borderColor = '';
    } else {
        errorTooltip.style.visibility = 'visible';
        errorTooltip.style.opacity = '1';
        this.style.borderColor = '#ff4444';
    }
}

function generateQRCode(amount, productType) {
    try {
        const form = document.getElementById('orderForm');
        const firstName = form.querySelector('input[name="firstName"]').value;
        const lastName = form.querySelector('input[name="lastName"]').value;
        const orderId = document.querySelector('[data-order-id]').dataset.orderId.replace(/[-_]/g, '').slice(0, -12);

        let upiUrl = "upi://pay?";
        const params = {
            pa: UPI_ID,
            pn: UPI_RECEIVER_NAME,
            am: amount,
            tn: `${orderId} by ${firstName} ${lastName}`,
            cu: 'INR'
        };

        const queryString = Object.entries(params)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        upiUrl += queryString;

        const qr = qrcode(0, 'M');
        qr.addData(upiUrl);
        qr.make();

        const qrContainer = document.querySelector('.qr-container img');
        qrContainer.src = qr.createDataURL(4);
        
    } catch (error) {
        console.error('Error generating QR code:', error);
        alert('Error generating QR code. Please try again.');
    }
}

async function sendTelegramNotification(paymentMethod, telegramBotToken, telegramChatId) {
    try {
        const form = document.getElementById('orderForm');
        const formData = {
            firstName: form.querySelector('input[name="firstName"]').value,
            lastName: form.querySelector('input[name="lastName"]').value,
            email: form.querySelector('input[name="email"]').value,
            telegramUsername: form.querySelector('input[name="telegramMobile"]').value
        };

        const orderDetails = document.querySelector('[data-order-details]').dataset;
        
        // Format product type
        const productTypeMap = {
            'telegram': 'QuantCopierMT5-Telegram',
            'discord': 'QuantCopierMT5-Discord',
            'combo': 'QuantCopierMT5-Combo'
        };
        const formattedProductType = productTypeMap[orderDetails.productType] || orderDetails.productType;

        const message = `
🔔 <b>New Purchase Request!</b>

👤 <b><u>CUSTOMER DETAILS</u></b>:
<b>Name</b>: ${formData.firstName} ${formData.lastName}
<b>Email</b>: ${formData.email}
<b>Telegram</b>: ${formData.telegramUsername}

<b><u>ORDER DETAILS</u></b>:
<b>Order ID</b>: ${orderDetails.orderId}
<b>Product</b>: ${formattedProductType}
<b>Plan</b>: ${orderDetails.planName}
<b>Amount</b>: ${orderDetails.currency} ${orderDetails.amount}
<b>Payment Method</b>: ${paymentMethod}
`;

        if (!telegramBotToken || !telegramChatId) {
            console.error('Telegram configuration missing');
            return;
        }

        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to send Telegram notification:', errorData);
        }
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
}

function handlePaymentCompleted() {
    const formData = new FormData(document.getElementById('orderForm'));
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    sessionStorage.setItem('orderData', JSON.stringify(formObject));
    window.location.href = '/payment-acknowledgment';
} 