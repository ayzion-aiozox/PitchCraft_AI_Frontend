import { Component } from '@angular/core';
import { MATERIAL, SHARED_COMPONENTS, SHARED_MODULES } from '../../modules/shared-imports';

@Component({
  selector: 'app-language-dialog',
  standalone: true,
  imports: [SHARED_COMPONENTS, MATERIAL, SHARED_MODULES],
  templateUrl: './language-dialog.component.html',
  styleUrl: './language-dialog.component.scss',
})
export class LanguageDialogComponent {
  // Method to handle language selection
  onLanguageSelected(language: string): void {
    
  }
}
