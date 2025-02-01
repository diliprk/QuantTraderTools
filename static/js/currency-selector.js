document.addEventListener('DOMContentLoaded', function() {
  const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/INR';
  const FALLBACK_USDINR_RATE = 85;
  let currentExchangeRate = FALLBACK_USDINR_RATE;

  // Fetch exchange rate first
  fetch(EXCHANGE_RATE_API)
    .then(response => response.json())
    .then(data => {
      // The API gives rates relative to INR, so we need the inverse for USD to INR
      currentExchangeRate = 1 / data.rates.USD;
    })
    .catch(err => {
      console.error('Error fetching exchange rate:', err);
      // Use fallback rate if API fails
      currentExchangeRate = FALLBACK_USDINR_RATE;
    })
    .finally(() => {
      // After getting exchange rate, proceed with location detection
      detectUserLocation();
    });

  function detectUserLocation() {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        const currency = data.currency;
        const select = document.getElementById('currencySelect');
        if (currency === 'INR') {
          select.value = 'INR';
          updatePrices('INR');
        } else {
          select.value = 'USD';
          updatePrices('USD');
        }
      })
      .catch(err => {
        console.error('Error detecting location:', err);
        // Default to USD when location detection fails
        const select = document.getElementById('currencySelect');
        select.value = 'USD';
        updatePrices('USD');
      });
  }

  // Handle currency change
  document.getElementById('currencySelect').addEventListener('change', function(e) {
    updatePrices(e.target.value);
  });

  // Handle tab changes
  document.querySelectorAll('.nav-link[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function() {
      const currency = document.getElementById('currencySelect').value;
      updatePrices(currency);
    });
  });

  function updatePrices(currency) {
    const baseUSDPrices = {
      monthly: { 
        telegram: 10, 
        discord: 10, 
        combo: 20 
      },
      halfYear: { 
        telegram: 50, 
        discord: 50, 
        combo: 80 
      },
      yearly: { 
        telegram: 100, 
        discord: 100, 
        combo: 160 
      },
      lifetime: { 
        telegram: 200, 
        discord: 200, 
        combo: 320 
      }
    };

    const symbols = {
      USD: '$',
      INR: '₹'
    };

    document.querySelectorAll('.tab-pane').forEach(tabPane => {
      const tabId = tabPane.id;
      
      tabPane.querySelectorAll('.plan-price .price').forEach(element => {
        const planType = element.closest('.price-plan').querySelector('.plane-name').textContent.toLowerCase().trim();
        let price;
        
        // Get base USD price
        switch(planType) {
          case 'monthly':
            price = baseUSDPrices.monthly[tabId];
            break;
          case '6 months':
            price = baseUSDPrices.halfYear[tabId];
            break;
          case 'annual':
            price = baseUSDPrices.yearly[tabId];
            break;
          case 'lifetime':
            price = baseUSDPrices.lifetime[tabId];
            break;
        }

        if (price) {
          // Convert to INR if needed and round to nearest 10
          if (currency === 'INR') {
            price = Math.round(price * currentExchangeRate / 10) * 10;
          }
          element.innerHTML = `${price}<sup class="currency-symbol">${symbols[currency]}</sup>`;
        }
      });
    });

    // Update radio buttons in payment modal - Add null check
    const rupeesRadio = document.getElementById('customRadioSvg1');
    const dollarRadio = document.getElementById('customRadioSvg2');
    
    // Only update radio buttons if they exist
    if (rupeesRadio && dollarRadio) {
      if (currency === 'INR') {
        rupeesRadio.checked = true;
      } else {
        dollarRadio.checked = true;
      }
    }
  }
});