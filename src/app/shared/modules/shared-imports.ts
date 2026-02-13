import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CircularImageComponent } from '../components/circular-image/circular-image.component';
import { DateTimeComponent } from '../components/date-time/date-time.component';
import { LanguageDialogComponent } from '../components/language-dialog/language-dialog.component';
import { LanguagesComponent } from '../components/languages/languages.component';
import { RadioButtonComponent } from '../components/radio-button/radio-button.component';
import { SelectComponent } from '../components/select/select.component';
import { InputTextComponent } from '../components/text-input/text-input.component';

/** Angular Material modules used across the app */
export const MATERIAL = [
  MatDatepickerModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
];

/** Shared modules (forms, layout, i18n) for feature imports */
export const SHARED_MODULES = [
  FlexLayoutModule,
  ReactiveFormsModule,
  CommonModule,
  FormsModule,
  TranslateModule,
];

/** Reusable UI components for feature imports */
export const SHARED_COMPONENTS = [
  CircularImageComponent,
  DateTimeComponent,
  LanguageDialogComponent,
  LanguagesComponent,
  RadioButtonComponent,
  SelectComponent,
  InputTextComponent,
];
