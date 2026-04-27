import { Component } from '@angular/core';
import { LanguagesComponent } from '../languages/languages.component';

@Component({
  selector: 'app-language-dialog',
  standalone: true,
  imports: [LanguagesComponent],
  templateUrl: './language-dialog.component.html',
  styleUrl: './language-dialog.component.scss',
})
export class LanguageDialogComponent {
  // Method to handle language selection
  onLanguageSelected(language: string): void {
    
  }
}
