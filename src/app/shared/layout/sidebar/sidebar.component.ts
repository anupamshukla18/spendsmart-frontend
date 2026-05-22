import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-logo">💰</div>
        @if (!collapsed) {
          <span class="brand-name">SpendSmart</span>
        }
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        @for (item of navItems; track item.path) {
          <a
            class="nav-item"
            [routerLink]="item.path"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            @if (!collapsed) {
              <span class="nav-label">{{ item.label }}</span>
            }
          </a>
        }
      </nav>

      <!-- Collapse Toggle -->
      <button class="collapse-btn" (click)="toggleCollapse.emit()">
        <span class="nav-icon">{{ collapsed ? "▶" : "◀" }}</span>
        @if (!collapsed) {
          <span class="nav-label">Collapse</span>
        }
      </button>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: var(--sidebar-width);
        background: var(--bg-secondary);
        border-right: 1px solid var(--border-subtle);
        display: flex;
        flex-direction: column;
        z-index: 100;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
      }

      .sidebar.collapsed {
        width: var(--sidebar-collapsed-width);
      }

      .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px;
        border-bottom: 1px solid var(--border-subtle);
        min-height: var(--header-height);
      }

      .brand-logo {
        font-size: 1.75rem;
        min-width: 32px;
        text-align: center;
      }

      .brand-name {
        font-size: 1.25rem;
        font-weight: 800;
        background: linear-gradient(
          135deg,
          var(--color-primary-light),
          var(--color-accent)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        white-space: nowrap;
      }

      .sidebar-nav {
        flex: 1;
        padding: 12px 8px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow-y: auto;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 14px;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        font-weight: 500;
        font-size: 0.9375rem;
        transition: all var(--transition-fast);
        text-decoration: none;
        white-space: nowrap;
        position: relative;
      }

      .nav-item:hover {
        background: var(--bg-card);
        color: var(--text-primary);
      }

      .nav-item.active {
        background: var(--color-primary-glow);
        color: var(--color-primary-light);
      }

      .nav-item.active::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 60%;
        border-radius: 0 4px 4px 0;
        background: var(--color-primary);
      }

      .nav-icon {
        font-size: 1.125rem;
        min-width: 24px;
        text-align: center;
      }

      .collapse-btn {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        margin: 8px;
        border-radius: var(--radius-md);
        background: transparent;
        color: var(--text-muted);
        font-size: 0.875rem;
        transition: all var(--transition-fast);
        white-space: nowrap;
      }

      .collapse-btn:hover {
        background: var(--bg-card);
        color: var(--text-primary);
      }

      @media (max-width: 768px) {
        .sidebar {
          transform: translateX(-100%);
        }
      }
    `,
  ],
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  navItems: NavItem[] = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/expenses", label: "Expenses", icon: "💸" },
    { path: "/income", label: "Income", icon: "💰" },
    { path: "/budgets", label: "Budgets", icon: "🎯" },
    { path: "/categories", label: "Categories", icon: "🏷️" },
    { path: "/analytics", label: "Analytics", icon: "📈" },
    { path: "/recurring", label: "Recurring", icon: "🔄" },
    { path: "/notifications", label: "Notifications", icon: "🔔" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];
}
