// Global variables
let stripeData = [];
let currentTheme = 'light';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkTheme();
    loadStripeData();
});

// Check and apply saved theme
function checkTheme() {
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
    }
}

// Toggle theme
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('dashboard-theme', currentTheme);
    
    // Update charts with new theme
    if (stripeData.length > 0) {
        updateAllCharts();
    }
}

// Load Stripe data
async function loadStripeData() {
    showLoading(true);
    
    try {
        // Fetch from Stripe API (simulated with your actual data)
        stripeData = await fetchStripeData();
        
        // Update dashboard
        updateStats();
        updateAllCharts();
        updateTransactionTable();
        
        showLoading(false);
    } catch (error) {
        console.error('Error loading Stripe data:', error);
        showError(true);
        showLoading(false);
    }
}

// Fetch Stripe data (using your actual transaction data)
async function fetchStripeData() {
    // Your actual Stripe transactions
    return [
        {
            date: '2025-01-30',
            amount: 49900,
            currency: 'USD',
            customer: 'Samuel Polsky',
            paymentMethod: 'Visa ••••2382',
            status: 'succeeded'
        },
        {
            date: '2025-02-06',
            amount: 39900,
            currency: 'INR',
            customer: 'Rodman Henley',
            paymentMethod: 'Mastercard ••••6043',
            status: 'succeeded'
        },
        {
            date: '2025-02-06',
            amount: 39900,
            currency: 'INR',
            customer: 'Rodman Henley',
            paymentMethod: 'Mastercard ••••6043',
            status: 'succeeded'
        }
    ];
}

// Update KPI stats
function updateStats() {
    const totalRevenue = stripeData.reduce((sum, tx) => sum + tx.amount, 0);
    const totalTransactions = stripeData.length;
    const avgAmount = totalRevenue / totalTransactions;
    
    // Convert to display format
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('totalTransactions').textContent = totalTransactions.toLocaleString();
    document.getElementById('avgAmount').textContent = formatCurrency(avgAmount);
}

// Update all charts
function updateAllCharts() {
    createRevenueChart();
    createPaymentMethodChart();
    createCurrencyChart();
    createCustomerChart();
}

// Create revenue timeline chart
function createRevenueChart() {
    const sortedData = [...stripeData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dates = sortedData.map(tx => tx.date);
    const amounts = sortedData.map(tx => tx.amount / 100); // Convert cents to dollars
    
    const trace = {
        x: dates,
        y: amounts,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Revenue',
        line: {
            color: '#6366f1',
            width: 3
        },
        marker: {
            color: '#6366f1',
            size: 8,
            line: {
                color: 'white',
                width: 2
            }
        },
        fill: 'tozeroy',
        fillcolor: 'rgba(99, 102, 241, 0.1)'
    };
    
    const layout = {
        title: '',
        xaxis: {
            title: 'Date',
            gridcolor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
            tickfont: { color: currentTheme === 'dark' ? '#f9fafb' : '#374151' }
        },
        yaxis: {
            title: 'Amount ($)',
            gridcolor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
            tickfont: { color: currentTheme === 'dark' ? '#f9fafb' : '#374151' },
            tickprefix: '$'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: currentTheme === 'dark' ? '#f9fafb' : '#374151' },
        margin: { t: 20, r: 20, b: 40, l: 60 },
        showlegend: false,
        hovermode: 'x unified'
    };
    
    Plotly.newPlot('revenueChart', [trace], layout, {responsive: true});
}

// Create payment method chart
function createPaymentMethodChart() {
    const paymentMethods = {};
    
    stripeData.forEach(tx => {
        const method = tx.paymentMethod.split(' ••••')[0]; // Get card type
        paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    });
    
    const values = Object.values(paymentMethods);
    const labels = Object.keys(paymentMethods);
    
    const trace = {
        values: values,
        labels: labels,
        type: 'pie',
        marker: {
            colors: ['#6366f1', '#22d3ee', '#10b981', '#f59e0b']
        },
        textinfo: 'label+percent',
        textposition: 'outside',
        textfont: {
            size: 12,
            color: currentTheme === 'dark' ? '#f9fafb' : '#374151'
        }
    };
    
    const layout = {
        title: '',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: currentTheme === 'dark' ? '#f9fafb' : '#374151' },
        margin: { t: 20, r: 20, b: 20, l: 20 },
        showlegend: true,
        legend: {
            x: 1,
            y: 0.5,
            bgcolor: 'rgba(0,0,0,0)'
        }
    };
    
    Plotly.newPlot('paymentChart', [trace], layout, {responsive: true});
}

// Create currency distribution chart
function createCurrencyChart() {
    const currencies = {};
    
    stripeData.forEach(tx => {
        currencies[tx.currency] = (currencies[tx.currency] || 0) + 1;
    });
    
    const values = Object.values(currencies);
    const labels = Object.keys(currencies);
    
    const trace = {
        values: values,
        labels: labels,
        type: 'pie',
        marker: {
            colors: ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6']
        },
        textinfo: 'label+percent',
        textposition: 'outside',
        textfont: {
            size: 12,
            color: currentTheme === 'dark' ? '#f9fafb' : '#374151'
        }
    };
    
    const layout = {
        title: '',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: currentTheme === 'dark' ? '#f9fafb' : '#374151' },
        margin: { t: 20, r: 20, b: 20, l: 20 }
    };
    
    Plotly.newPlot('currencyChart', [trace], layout, {responsive: true});
}

// Create customer analytics chart
function createCustomerChart() {
    const customers = {};
    
    stripeData.forEach(tx => {
        customers[tx.customer] = (customers[tx.customer] || 0) + 1;
    });
    
    const values = Object.values(customers);
    const labels = Object.keys(customers);
    
    const trace = {
        x: labels,
        y: values,
        type: 'bar',
        marker: {
            color: '#6366f1',
            line: {
                color: '#4f46e5',
                width: 2
            }
        },
        text: values,
        textposition: 'auto',
        textfont: {
            color: currentTheme === 'dark' ? '#f9fafb' : '#374151'
        }
    };
    
    const layout = {
        title: '',
        xaxis: {
            title: 'Customer',
            gridcolor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
            tickfont: { color: currentTheme === 'dark' ? '#f9fafb' : '#374151' }
        },
        yaxis: {
            title: 'Transactions',
            gridcolor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
            tickfont: { color: currentTheme === 'dark' ? '#f9fafb' : '#374151' }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: currentTheme === 'dark' ? '#f9fafb' : '#374151' },
        margin: { t: 20, r: 20, b: 60, l: 60 },
        showlegend: false
    };
    
    Plotly.newPlot('customerChart', [trace], layout, {responsive: true});
}

// Update transaction table
function updateTransactionTable() {
    const tbody = document.getElementById('transactionBody');
    tbody.innerHTML = '';
    
    stripeData.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(tx.date)}</td>
            <td>${formatCurrency(tx.amount)}</td>
            <td>${tx.currency}</td>
            <td>${tx.customer}</td>
            <td>${tx.paymentMethod}</td>
            <td><span class="status-badge status-success">${tx.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Format currency
function formatCurrency(amount) {
    const dollars = amount / 100;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(dollars);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show/hide loading
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'flex' : 'none';
}

// Show/hide error
function showError(show) {
    document.getElementById('error').style.display = show ? 'block' : 'none';
}

// Refresh data
function refreshData() {
    loadStripeData();
}