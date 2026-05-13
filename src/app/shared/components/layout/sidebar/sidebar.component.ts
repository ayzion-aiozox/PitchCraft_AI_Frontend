import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Sparkles, FlaskConical, Users, Target, Monitor, Rocket, BarChart3, Puzzle, Settings, LogOut, PanelLeftClose, PanelLeftOpen, Lightbulb } from 'lucide-angular';
import { NavigationService } from '../../../services/navigation.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MenuItem } from '../../../models/menu-item.model';
import { Observable } from 'rxjs';
import type { IsActiveMatchOptions } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  /**
   * Stable refs for routerLinkActive — a new object each CD tick can retrigger
   * RouterLinkActive and cause an infinite change-detection loop (frozen UI / “loading”).
   */
  private static readonly linkActiveExact: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  };
  private static readonly linkActiveSubset: IsActiveMatchOptions = {
    paths: 'subset',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  };

  private navigationService = inject(NavigationService);
  private auth = inject(AuthService);

  menuItems$: Observable<MenuItem[]>;
  bottomItems$: Observable<MenuItem[]>;

  collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  // Icons must be explicitly defined for lucide-angular
  readonly icons = {
    LayoutDashboard,
    Sparkles,
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
    PanelLeftOpen,
    Lightbulb
  };

  constructor() {
    this.menuItems$ = this.navigationService.menuItems$;
    this.bottomItems$ = this.navigationService.bottomItems$;
  }

  ngOnInit(): void {}

  /** `/ai` uses exact match so `/ai-idea-lab` does not activate AI Workspace. */
  navLinkActiveOptions(route: string): IsActiveMatchOptions {
    return route === '/ai' ? SidebarComponent.linkActiveExact : SidebarComponent.linkActiveSubset;
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