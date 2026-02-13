import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { BreakpointService } from '../../../../core/services/breakpoint.service';
import { HideWhenDirective } from '../../../directives/responsive.directive';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [HideWhenDirective],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() searchPlaceholder = 'Search...';
  @Input() userName = 'Sarah Jenning';
  @Input() avatarUrl = 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FEuropean%2F3';
  /** When set, header shows breadcrumb: title > breadcrumbActive (no search area) */
  @Input() breadcrumbActive?: string;
  @Input() showSearch = true;
  /** When true, search is shown even when breadcrumbActive is set (e.g. Product Lab) */
  @Input() showSearchWithBreadcrumb = false;
  @Input() showUserName = true;
  @Input() showHelpButton = false;

  readonly breakpoint = inject(BreakpointService);
}
