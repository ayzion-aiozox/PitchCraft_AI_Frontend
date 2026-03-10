import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, FlaskConical, Users, Target, Monitor, Rocket, BarChart3, Puzzle, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-angular';
import { NavigationService } from '../../../services/navigation.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MenuItem } from '../../../models/menu-item.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private navigationService = inject(NavigationService);
  private router = inject(Router);
  private auth = inject(AuthService);

  menuItems$: Observable<MenuItem[]>;
  bottomItems$: Observable<MenuItem[]>;

  collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  // Icons must be explicitly defined for lucide-angular
  readonly icons = {
    LayoutDashboard,
    FlaskConical,
    Users,
    Target,
    Monitor,
    Rocket,
    BarChart3,
    Puzzle,
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen
  };

  constructor() {
    this.menuItems$ = this.navigationService.menuItems$;
    this.bottomItems$ = this.navigationService.bottomItems$;
  }

  ngOnInit(): void {}

  isActive(route: string): boolean {
    const url = this.router.url;
    if (url.includes(route)) return true;
    // Routes that redirect: highlight when we're on the actual path
    if ((route === '/campaigns' || route === '/campaign-engine') && url.includes('/campaign-engine')) return true;
    if ((route === '/analytics' || route === '/intelligence-hub') && url.includes('/intelligence-hub')) return true;
    return false;
  }

  getIcon(name: string) {
    return this.icons[name as keyof typeof this.icons];
  }

  logout(): void {
    this.auth.logout();
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}