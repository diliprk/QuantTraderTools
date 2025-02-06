function handlePay(type, key) {
    // Get selected currency from header
    const currencySelect = document.getElementById('currencySelect');
    const selectedCurrency = currencySelect.value;
    
    // Find the clicked plan's price
    const clickedButton = event.target;
    const priceCard = clickedButton.closest('.price-plan');
    const priceElement = priceCard.querySelector('.price');
    const planName = priceCard.querySelector('.plane-name').textContent;
    const price = priceElement.textContent.replace(/[^0-9]/g, ''); // Remove currency symbol
    
    // Get plan type (telegram/discord/combo)
    const tabPane = clickedButton.closest('.tab-pane');
    const productType = tabPane.id;
    
    // Generate order ID matching server format
    const now = new Date();
    const timestamp = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(/[^\d]/g, '');
    
    const typePrefix = productType.toUpperCase();
    const orderId = `QCMT5-${typePrefix}-${timestamp}`;

    // Prepare API payload
    const payload = {
        merchantID: "MID12345AAPL",
        orderID: orderId,
        item: `QuantCopier MT5 ${productType.charAt(0).toUpperCase() + productType.slice(1)}`,
        currency: selectedCurrency === 'USD' ? '$' : '₹',
        totalAmount: parseInt(price)
    };

    // Make API call to payment validation endpoint
    fetch('https://payment-checkout-sigma.vercel.app/api/payment-validation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || 'Payment validation failed');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('API Response:', data);
        if (data.url) {
            // Open the payment URL in a new tab/window
            window.open(data.url, '_blank');
        } else {
            throw new Error('No payment URL received from server');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Payment processing failed. Please try again. Error: ' + error.message);
    });
}