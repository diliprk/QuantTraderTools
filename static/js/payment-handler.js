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
    
    // Construct URL with parameters
    const params = new URLSearchParams({
        subscription_type: type,
        license_key: key,
        currency: selectedCurrency,
        amount: price,
        plan_name: planName,
        product_type: productType
    });
    
    // Redirect to order summary page
    window.location.href = `/order-summary?${params.toString()}`;
}

// Add new functions for payment handling
async function handleUPIPayment(event, orderId, amount, productType) {
    event.preventDefault();
    
    if (!validateForm()) return false;
    
    const telegramConfig = getTelegramConfig();
    await sendTelegramNotification('UPI', telegramConfig.botToken, telegramConfig.chatId);
    
    // Show UPI modal
    document.getElementById('upiModal').style.display = 'flex';
    
    // Generate QR code
    generateQRCode(amount, productType);
}

async function handleWisePayment(event, amount, orderId) {
    event.preventDefault();
    
    if (!validateForm()) return false;
    
    const telegramConfig = getTelegramConfig();
    await sendTelegramNotification('Wise', telegramConfig.botToken, telegramConfig.chatId);
    
    const wiseUrl = `https://wise.com/pay/business/diliprajkumar1?amount=${amount}&currency=USD&description=${orderId}`;
    window.open(wiseUrl);
    return false;
}

function validateForm() {
    const form = document.getElementById('orderForm');
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all fields before proceeding with payment');
        return false;
    }
    
    return true;
}

// Add this new function to get telegram config
function getTelegramConfig() {
    const scriptTag = document.querySelector('script[data-telegram-bot-token]');
    return {
        botToken: scriptTag.dataset.telegramBotToken,
        chatId: scriptTag.dataset.telegramChatId
    };
} 