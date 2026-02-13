import { Component, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef
import { TranslateService } from '@ngx-translate/core';
import { MATERIAL, SHARED_COMPONENTS } from '../../modules/shared-imports';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [MATERIAL, CommonModule, SHARED_COMPONENTS, ReactiveFormsModule],
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
})
export class LanguagesComponent implements OnInit {
  // Define language options
  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ur', label: 'Urdu' },
    { value: 'ar', label: 'Arabic' },
  ];

  // Store the current selected language
  selectedLanguage: string = '';

  // Emit selected language
  @Output() languageSelected = new EventEmitter<string>();

  formControl = new FormControl(); // Add form control for the radio group

  constructor(
    private translate: TranslateService,
    private dialogRef: MatDialogRef<LanguagesComponent> // Inject MatDialogRef
  ) {}

  ngOnInit() {
    // Set the selected language based on the current translation
    this.selectedLanguage = this.translate.currentLang;
    this.formControl.setValue(this.selectedLanguage); // Set initial value of radio button
  }

  // Handle language switch and close the dialog
  switchLanguage(language: string): void {
    this.translate.use(language); // Switch language
    this.languageSelected.emit(language); // Emit selected language
    this.dialogRef.close(); // Close the dialog
  }
}
