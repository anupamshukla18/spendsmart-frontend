import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-page">
      <!-- Navigation Bar -->
      <nav class="navbar">
        <div class="container">
          <div class="navbar-content">
            <div class="logo">
              <span class="logo-icon">💰</span>
              <span class="logo-text">SpendSmart</span>
            </div>
            <div class="nav-links">
              <a href="#features" class="nav-link">Features</a>
              <a href="#benefits" class="nav-link">Benefits</a>
              <a href="#pricing" class="nav-link">Pricing</a>
              <a href="#faq" class="nav-link">FAQ</a>
            </div>
            <div class="nav-actions">
              <a routerLink="/login" class="btn btn-secondary">Sign In</a>
              <a routerLink="/register" class="btn btn-primary">Get Started</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-content">
              <h1 class="hero-title">Smart Personal Finance Management</h1>
              <p class="hero-subtitle">
                Take control of your finances with intelligent expense tracking,
                budgeting, and financial analytics. Transform your financial
                habits today.
              </p>
              <div class="hero-actions">
                <a routerLink="/register" class="btn btn-primary btn-large"
                  >Start Free Today</a
                >
                <a routerLink="/login" class="btn btn-outline btn-large"
                  >Sign In</a
                >
              </div>
              <div class="hero-stats">
                <div class="stat">
                  <div class="stat-number">50K+</div>
                  <div class="stat-label">Active Users</div>
                </div>
                <div class="stat">
                  <div class="stat-number">$2M+</div>
                  <div class="stat-label">Tracked Expenses</div>
                </div>
                <div class="stat">
                  <div class="stat-number">98%</div>
                  <div class="stat-label">Satisfaction</div>
                </div>
              </div>
            </div>
            <div class="hero-visual">
              <div class="dashboard-preview">
                <div class="preview-header">
                  <div class="preview-dot"></div>
                  <div class="preview-dot"></div>
                  <div class="preview-dot"></div>
                </div>
                <div class="preview-content">
                  <div class="preview-card">
                    <div class="preview-label">Total Balance</div>
                    <div class="preview-value">$12,458</div>
                  </div>
                  <div class="preview-card">
                    <div class="preview-label">This Month</div>
                    <div class="preview-value">
                      <span class="value-positive">+$2,400</span>
                      <span class="value-negative">-$1,840</span>
                    </div>
                  </div>
                  <div class="preview-chart">
                    <div class="chart-bar" style="height: 60%"></div>
                    <div class="chart-bar" style="height: 80%"></div>
                    <div class="chart-bar" style="height: 45%"></div>
                    <div class="chart-bar" style="height: 90%"></div>
                    <div class="chart-bar" style="height: 70%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features">
        <div class="container">
          <h2 class="section-title">Powerful Features for Financial Control</h2>
          <p class="section-subtitle">
            Everything you need to manage your money effectively
          </p>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Expense Tracking</h3>
              <p>
                Automatically categorize and track every expense. Understand
                where your money goes with detailed analytics.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">💳</div>
              <h3>Budget Management</h3>
              <p>
                Set smart budgets for each category. Get alerts when you're
                close to your limits and stay in control.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">💰</div>
              <h3>Income Tracking</h3>
              <p>
                Record all your income sources. Monitor earnings, bonuses, and
                passive income in one place.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📈</div>
              <h3>Advanced Analytics</h3>
              <p>
                Get insights with powerful charts and reports. Visualize trends
                and identify saving opportunities.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🔄</div>
              <h3>Recurring Transactions</h3>
              <p>
                Set up recurring expenses and income. Automate your financial
                tracking for bills and subscriptions.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🔔</div>
              <h3>Smart Notifications</h3>
              <p>
                Receive timely alerts for budgets, recurring bills, and
                financial milestones you set.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section id="benefits" class="benefits">
        <div class="container">
          <div class="benefits-grid">
            <div class="benefit-item">
              <div class="benefit-icon">✨</div>
              <h3>Simple & Intuitive</h3>
              <p>
                Beautifully designed interface that's easy to use. Start
                tracking in seconds, no learning curve.
              </p>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>
                Bank-level security with end-to-end encryption. Your financial
                data is always protected.
              </p>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">🚀</div>
              <h3>Lightning Fast</h3>
              <p>
                Real-time sync across all your devices. Access your finances
                anywhere, anytime.
              </p>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">💡</div>
              <h3>AI-Powered Insights</h3>
              <p>
                Get personalized recommendations based on your spending patterns
                and financial goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="pricing">
        <div class="container">
          <h2 class="section-title">Simple, Transparent Pricing</h2>
          <p class="section-subtitle">Start for free, upgrade anytime</p>

          <div class="pricing-grid">
            <div class="pricing-card">
              <div class="plan-name">Free</div>
              <div class="plan-price">
                $0<span class="plan-period">/month</span>
              </div>
              <p class="plan-description">Perfect for getting started</p>
              <ul class="plan-features">
                <li>✓ Expense tracking</li>
                <li>✓ Basic budgets</li>
                <li>✓ Up to 3 categories</li>
                <li>✓ Monthly reports</li>
              </ul>
              <a routerLink="/register" class="btn btn-outline btn-block"
                >Get Started</a
              >
            </div>

            <div class="pricing-card featured">
              <div class="badge">Popular</div>
              <div class="plan-name">Pro</div>
              <div class="plan-price">
                $9.99<span class="plan-period">/month</span>
              </div>
              <p class="plan-description">For serious savers</p>
              <ul class="plan-features">
                <li>✓ Everything in Free</li>
                <li>✓ Unlimited categories</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Recurring transactions</li>
                <li>✓ Smart alerts</li>
              </ul>
              <a routerLink="/register" class="btn btn-primary btn-block"
                >Start Free Trial</a
              >
            </div>

            <div class="pricing-card">
              <div class="plan-name">Premium</div>
              <div class="plan-price">
                $19.99<span class="plan-period">/month</span>
              </div>
              <p class="plan-description">All features unlocked</p>
              <ul class="plan-features">
                <li>✓ Everything in Pro</li>
                <li>✓ Unlimited users</li>
                <li>✓ API access</li>
                <li>✓ Priority support</li>
                <li>✓ Custom reports</li>
              </ul>
              <a routerLink="/register" class="btn btn-outline btn-block"
                >Start Free Trial</a
              >
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="container">
          <h2>Ready to Take Control of Your Finances?</h2>
          <p>
            Join thousands of users saving money and achieving their financial
            goals
          </p>
          <div class="cta-actions">
            <a routerLink="/register" class="btn btn-primary btn-large"
              >Start Free Today</a
            >
            <a
              href="mailto:support@spendsmart.com"
              class="btn btn-outline btn-large"
              >Contact Sales</a
            >
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h4>SpendSmart</h4>
              <p>Smart personal finance management made simple.</p>
            </div>
            <div class="footer-section">
              <h5>Product</h5>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a routerLink="/register">Sign Up</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h5>Company</h5>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h5>Legal</h5>
              <ul>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2024 SpendSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .home-page {
        width: 100%;
        background: var(--bg-primary);
        color: var(--text-primary);
        overflow-x: hidden;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }

      /* ── Navbar ─────────────────────────────────────── */
      .navbar {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: rgba(10, 14, 26, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border-subtle);
        padding: 16px 0;
      }

      .navbar-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 32px;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.5rem;
        font-weight: 700;
        text-decoration: none;
        color: var(--text-primary);
      }

      .logo-icon {
        font-size: 1.75rem;
      }

      .nav-links {
        display: flex;
        gap: 32px;
        flex: 1;
      }

      .nav-link {
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        transition: color var(--transition-fast);
      }

      .nav-link:hover {
        color: var(--color-primary);
      }

      .nav-actions {
        display: flex;
        gap: 12px;
      }

      /* ── Hero Section ────────────────────────────────── */
      .hero {
        padding: 80px 0;
      }

      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: center;
      }

      .hero-title {
        font-size: 3rem;
        font-weight: 900;
        line-height: 1.2;
        margin-bottom: 24px;
        background: linear-gradient(
          135deg,
          var(--color-primary) 0%,
          var(--color-primary-light) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero-subtitle {
        font-size: 1.125rem;
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 32px;
      }

      .hero-actions {
        display: flex;
        gap: 16px;
        margin-bottom: 48px;
      }

      .hero-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 32px;
        margin-top: 32px;
      }

      .stat-number {
        font-size: 1.75rem;
        font-weight: 800;
        color: var(--color-primary);
      }

      .stat-label {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-top: 4px;
      }

      .dashboard-preview {
        background: var(--bg-card);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      }

      .preview-header {
        display: flex;
        gap: 8px;
        padding: 12px 16px;
        background: var(--bg-elevated);
        border-bottom: 1px solid var(--border-subtle);
      }

      .preview-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--border-light);
      }

      .preview-content {
        padding: 24px;
      }

      .preview-card {
        margin-bottom: 20px;
      }

      .preview-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-bottom: 6px;
      }

      .preview-value {
        font-size: 1.5rem;
        font-weight: 700;
        display: flex;
        gap: 12px;
      }

      .value-positive {
        color: var(--color-success);
      }

      .value-negative {
        color: var(--color-danger);
      }

      .preview-chart {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        height: 60px;
        margin-top: 16px;
      }

      .chart-bar {
        flex: 1;
        background: linear-gradient(
          180deg,
          var(--color-primary) 0%,
          var(--color-primary-dark) 100%
        );
        border-radius: 4px;
        opacity: 0.7;
      }

      .chart-bar:nth-child(2) {
        opacity: 1;
      }

      /* ── Features Section ────────────────────────────── */
      .features {
        padding: 80px 0;
        background: linear-gradient(
          180deg,
          transparent,
          rgba(16, 185, 129, 0.05)
        );
      }

      .section-title {
        font-size: 2.5rem;
        font-weight: 800;
        text-align: center;
        margin-bottom: 12px;
      }

      .section-subtitle {
        font-size: 1.125rem;
        color: var(--text-secondary);
        text-align: center;
        margin-bottom: 60px;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 32px;
      }

      .feature-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: 32px;
        transition: all var(--transition-base);
      }

      .feature-card:hover {
        border-color: var(--color-primary);
        background: var(--bg-card-hover);
        transform: translateY(-4px);
      }

      .feature-icon {
        font-size: 2.5rem;
        margin-bottom: 16px;
      }

      .feature-card h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .feature-card p {
        color: var(--text-secondary);
        line-height: 1.6;
      }

      /* ── Benefits Section ────────────────────────────── */
      .benefits {
        padding: 80px 0;
      }

      .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 40px;
      }

      .benefit-item {
        text-align: center;
      }

      .benefit-icon {
        font-size: 2rem;
        margin-bottom: 16px;
        display: inline-block;
      }

      .benefit-item h3 {
        font-size: 1.125rem;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .benefit-item p {
        color: var(--text-secondary);
        line-height: 1.6;
      }

      /* ── Pricing Section ────────────────────────────── */
      .pricing {
        padding: 80px 0;
        background: linear-gradient(
          180deg,
          transparent,
          rgba(16, 185, 129, 0.05)
        );
      }

      .pricing-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 32px;
        max-width: 1000px;
        margin: 0 auto;
      }

      .pricing-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: 32px;
        position: relative;
        transition: all var(--transition-base);
      }

      .pricing-card.featured {
        border-color: var(--color-primary);
        background: var(--bg-card-hover);
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
      }

      .pricing-card:hover {
        border-color: var(--color-primary);
      }

      .badge {
        position: absolute;
        top: -12px;
        left: 24px;
        background: var(--color-primary);
        color: var(--text-inverse);
        padding: 6px 16px;
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
      }

      .plan-name {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .plan-price {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 8px;
      }

      .plan-period {
        font-size: 1rem;
        color: var(--text-secondary);
      }

      .plan-description {
        color: var(--text-secondary);
        margin-bottom: 24px;
        font-size: 0.9375rem;
      }

      .plan-features {
        list-style: none;
        margin-bottom: 24px;
      }

      .plan-features li {
        padding: 12px 0;
        color: var(--text-secondary);
        font-size: 0.9375rem;
        border-bottom: 1px solid var(--border-subtle);
      }

      .plan-features li:last-child {
        border-bottom: none;
      }

      /* ── CTA Section ────────────────────────────────── */
      .cta {
        padding: 80px 0;
        background: linear-gradient(
          135deg,
          rgba(16, 185, 129, 0.1),
          rgba(59, 130, 246, 0.1)
        );
        border-top: 1px solid var(--border-subtle);
        border-bottom: 1px solid var(--border-subtle);
        text-align: center;
      }

      .cta h2 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 12px;
      }

      .cta p {
        font-size: 1.125rem;
        color: var(--text-secondary);
        margin-bottom: 32px;
      }

      .cta-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
      }

      /* ── Buttons ────────────────────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 24px;
        border-radius: var(--radius-md);
        font-weight: 600;
        text-decoration: none;
        border: none;
        cursor: pointer;
        transition: all var(--transition-fast);
        font-size: 1rem;
      }

      .btn-primary {
        background: var(--color-primary);
        color: var(--text-inverse);
      }

      .btn-primary:hover {
        background: var(--color-primary-light);
      }

      .btn-secondary {
        background: transparent;
        color: var(--text-primary);
        border: 1px solid var(--border-light);
      }

      .btn-secondary:hover {
        background: var(--bg-elevated);
        border-color: var(--color-primary);
      }

      .btn-outline {
        background: transparent;
        color: var(--text-primary);
        border: 1px solid var(--border-light);
      }

      .btn-outline:hover {
        border-color: var(--color-primary);
        background: rgba(16, 185, 129, 0.1);
      }

      .btn-large {
        padding: 16px 32px;
        font-size: 1.0625rem;
      }

      .btn-block {
        width: 100%;
      }

      /* ── Footer ─────────────────────────────────────── */
      .footer {
        background: var(--bg-secondary);
        border-top: 1px solid var(--border-subtle);
        padding: 60px 0 20px;
        margin-top: 80px;
      }

      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 40px;
        margin-bottom: 40px;
      }

      .footer-section h4,
      .footer-section h5 {
        margin-bottom: 12px;
      }

      .footer-section h5 {
        font-size: 0.9375rem;
        text-transform: uppercase;
        color: var(--text-secondary);
        letter-spacing: 0.5px;
      }

      .footer-section p,
      .footer-section a {
        color: var(--text-secondary);
        font-size: 0.9375rem;
        text-decoration: none;
        margin-bottom: 8px;
      }

      .footer-section a:hover {
        color: var(--color-primary);
      }

      .footer-section ul {
        list-style: none;
      }

      .footer-bottom {
        border-top: 1px solid var(--border-subtle);
        padding-top: 20px;
        text-align: center;
        color: var(--text-muted);
        font-size: 0.875rem;
      }

      /* ── Responsive ────────────────────────────────── */
      @media (max-width: 768px) {
        .navbar-content {
          flex-wrap: wrap;
          gap: 16px;
        }

        .nav-links {
          order: 3;
          width: 100%;
          flex-direction: column;
          gap: 12px;
        }

        .nav-actions {
          flex-direction: column;
          width: 100%;
        }

        .hero {
          padding: 60px 0;
        }

        .hero-grid {
          grid-template-columns: 1fr;
          gap: 40px;
        }

        .hero-title {
          font-size: 2rem;
        }

        .hero-stats {
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .hero-actions {
          flex-direction: column;
        }

        .pricing-card.featured {
          transform: none;
        }

        .features,
        .benefits,
        .pricing,
        .cta {
          padding: 60px 0;
        }

        .section-title {
          font-size: 1.75rem;
        }

        .cta h2 {
          font-size: 1.75rem;
        }

        .cta-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class HomeComponent {}
