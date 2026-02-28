// Reusable Components System for Stripe Analytics Empire
// Provides consistent header, navigation, and theme across all pages

class HeaderComponent {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.theme = localStorage.getItem('dashboard-theme') || 'light';
        this.init();
    }

    init() {
        this.createHeaderHTML();
        this.bindEvents();
        this.applyTheme();
        this.updateActiveNavigation();
    }

    createHeaderHTML() {
        const headerHTML = `
            <header class="empire-header">
                <div class="empire-brand">
                    <h1 class="empire-title">
                        <span class="empire-icon">🚀</span>
                        <span class="empire-text">Stripe Analytics Empire</span>
                        <div class="empire-subtitle">Enterprise Analytics Platform</div>
                    </h1>
                    <div class="empire-controls">
                        <button class="theme-toggle" onclick="components.header.toggleTheme()" title="Toggle theme">
                            <span class="theme-icon">🏡</span>
                        </button>
                        <button class="refresh-btn" onclick="components.header.refreshData()" title="Refresh all data">
                            <span class="refresh-icon">🔄</span>
                        </button>
                    </div>
                </div>
                <div class="empire-stats">
                    <div class="stat-group">
                        <div class="stat-item">
                            <div class="stat-value" id="totalRevenue">$0</div>
                            <div class="stat-label">Total Revenue</div>
                            <div class="stat-change" id="revenueChange">-</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="activeUsers">0</div>
                            <div class="stat-label">Active Users</div>
                        </div>
                    </div>
                    <div class="stat-group">
                        <div class="stat-item">
                            <div class="stat-value" id="totalTransactions">0</div>
                            <div class="stat-label">Transactions</div>
                            <div class="stat-change" id="transactionChange">-</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="successRate">0%</div>
                            <div class="stat-label">Success Rate</div>
                        </div>
                    </div>
                </div>
                <nav class="empire-nav">
                    <a href="index.html" class="nav-link" data-page="index.html">
                        <span class="nav-icon">📊</span>
                        <span class="nav-text">Overview</span>
                    </a>
                    <a href="revenue.html" class="nav-link" data-page="revenue.html">
                        <span class="nav-icon">📈</span>
                        <span class="nav-text">Revenue</span>
                    </a>
                    <a href="customers.html" class="nav-link" data-page="customers.html">
                        <span class="nav-icon">👥</span>
                        <span class="nav-text">Customers</span>
                    </a>
                    <a href="payments.html" class="nav-link" data-page="payments.html">
                        <span class="nav-icon">💳</span>
                        <span class="nav-text">Payments</span>
                    </a>
                    <a href="financial.html" class="nav-link" data-page="financial.html">
                        <span class="nav-icon">💰</span>
                        <span class="nav-text">Financial</span>
                    </a>
                    <a href="intelligence.html" class="nav-link" data-page="intelligence.html">
                        <span class="nav-icon">🧠</span>
                        <span class="nav-text">Intelligence</span>
                    </a>
                    <a href="api-integration.html" class="nav-link" data-page="api-integration.html">
                        <span class="nav-icon">🔗</span>
                        <span class="nav-text">API Hub</span>
                    </a>
                    <div class="nav-indicator"></div>
                </nav>
            </header>
        `;

        // Insert into DOM or replace existing header
        let existingHeader = document.querySelector('header');
        if (existingHeader) {
            existingHeader.innerHTML = headerHTML;
        } else {
            // Insert at the top of body if no header exists
            document.body.insertAdjacentHTML('afterbegin', headerHTML);
        }
    }

    bindEvents() {
        // Theme toggle
        const themeBtn = document.querySelector('.theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Refresh button
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.updateActiveNavigation(e.target.closest('.nav-link').dataset.page);
            });
        });
    }

    updateActiveNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${this.currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            // Add indicator
            const indicator = document.querySelector('.nav-indicator');
            if (indicator) {
                indicator.style.opacity = '1';
                indicator.style.transform = 'translateX(' + activeLink.offsetLeft + 'px)';
            }
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('dashboard-theme', this.theme);
        this.applyTheme();
        this.updateThemeButton();
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.theme }
        }));
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Update theme icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'light' ? '\ud83c\udfe1' : '\ud83c\udfe0';
        }
    }

    updateThemeButton() {
        const themeBtn = document.querySelector('.theme-toggle');
        if (themeBtn) {
            themeBtn.setAttribute('title', this.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
        }
    }

    updateStats(data) {
        if (data.totalRevenue !== undefined) {
            const revenueEl = document.getElementById('totalRevenue');
            if (revenueEl) {
                revenueEl.textContent = this.formatCurrency(data.totalRevenue);
                const changeEl = document.getElementById('revenueChange');
                if (changeEl && data.revenueChange) {
                    changeEl.textContent = data.revenueChange > 0 ? `+${data.revenueChange.toFixed(1)}%` : `${data.revenueChange.toFixed(1)}%`;
                    changeEl.className = data.revenueChange > 0 ? 'stat-positive' : 'stat-negative';
                }
            }
        }
        
        if (data.activeUsers !== undefined) {
            const usersEl = document.getElementById('activeUsers');
            if (usersEl) {
                usersEl.textContent = data.activeUsers.toLocaleString();
            }
        }
        
        if (data.totalTransactions !== undefined) {
            const transactionsEl = document.getElementById('totalTransactions');
            if (transactionsEl) {
                transactionsEl.textContent = data.totalTransactions.toLocaleString();
                const changeEl = document.getElementById('transactionChange');
                if (changeEl && data.transactionChange) {
                    changeEl.textContent = data.transactionChange > 0 ? `+${data.transactionChange.toFixed(1)}%` : `${data.transactionChange.toFixed(1)}%`;
                    changeEl.className = data.transactionChange > 0 ? 'stat-positive' : 'stat-negative';
                }
            }
        }
        
        if (data.successRate !== undefined) {
            const successEl = document.getElementById('successRate');
            if (successEl) {
                successEl.textContent = `${data.successRate.toFixed(1)}%`;
            }
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    refreshData() {
        // Show loading state
        const refreshBtn = document.querySelector('.refresh-btn');
        const originalContent = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<span class="refresh-icon spinning">\ud83d\udfe1</span>';
        refreshBtn.disabled = true;
        
        // Simulate data refresh
        setTimeout(() => {
            location.reload();
        }, 1000);
        
        // Reset after a moment
        setTimeout(() => {
            refreshBtn.innerHTML = originalContent;
            refreshBtn.disabled = false;
        }, 3000);
    }

    updatePageTitle(title) {
        const titleEl = document.querySelector('.empire-title .empire-text');
        if (titleEl) {
            titleEl.textContent = title;
        }
    }
}

// Theme Manager for component consistency
class ThemeManager {
    static getTheme() {
        return localStorage.getItem('dashboard-theme') || 'light';
    }

    static applyThemeGlobally(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('dashboard-theme', theme);
    }

    static onThemeChange(callback) {
        const handleThemeChange = (event) => {
            callback(event.detail.theme);
        };
        window.addEventListener('themeChanged', handleThemeChange);
    }
}

// Global component instance
window.components = window.components || {};
window.components.header = new HeaderComponent();
window.components.theme = ThemeManager;