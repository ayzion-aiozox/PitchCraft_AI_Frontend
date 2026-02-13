import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, FlaskConical, Users, Target, Monitor, Rocket, BarChart3, Puzzle, Settings } from 'lucide-angular';
import { NavigationService } from '../../../services/navigation.service';
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

  menuItems$: Observable<MenuItem[]>;
  bottomItems$: Observable<MenuItem[]>;

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
    Settings
  };

  constructor() {
    this.menuItems$ = this.navigationService.menuItems$;
    this.bottomItems$ = this.navigationService.bottomItems$;
  }

  ngOnInit(): void {}

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  getIcon(name: string) {
    return this.icons[name as keyof typeof this.icons];
  }
}