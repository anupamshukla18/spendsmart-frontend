import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-layout" [class.sidebar-collapsed]="sidebarCollapsed">
      <app-sidebar
        [collapsed]="sidebarCollapsed"
        (toggleCollapse)="sidebarCollapsed = !sidebarCollapsed">
      </app-sidebar>
      <div class="main-area">
        <app-header (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed"></app-header>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }
    .main-area {
      flex: 1;
      margin-left: var(--sidebar-width);
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }
    .sidebar-collapsed .main-area {
      margin-left: var(--sidebar-collapsed-width);
    }
    .main-content {
      flex: 1;
      padding: var(--space-xl);
      margin-top: var(--header-height);
      max-width: 1400px;
      width: 100%;
    }
    @media (max-width: 768px) {
      .main-area {
        margin-left: 0 !important;
      }
      .main-content {
        padding: var(--space-md);
      }
    }
  `]
})
export class LayoutComponent {
  sidebarCollapsed = false;
}
