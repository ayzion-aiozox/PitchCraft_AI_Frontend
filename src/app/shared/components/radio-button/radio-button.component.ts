import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MATERIAL, SHARED_MODULES } from '../../modules/shared-imports';

@Component({
  selector: 'app-radio-button',
  standalone: true,
  imports: [MATERIAL, SHARED_MODULES],
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent {
  @Input() label: string = ''; // Optional label for the radio group
  @Input() options: { value: string, label: string }[] = []; // Options for radio buttons
  @Input() formControl: FormControl = new FormControl(); // Form control for reactive forms
  @Input() disabled: boolean = false; // Disabled state for the radio buttons

  @Output() selectedValue = new EventEmitter<string>(); // Emit selected value

  onRadioChange(value: string): void {
    this.selectedValue.emit(value); // Emit the selected value when the radio button is clicked
  }
}

