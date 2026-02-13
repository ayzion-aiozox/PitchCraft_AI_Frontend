import { Component, Input } from '@angular/core';
import { MATERIAL, SHARED_MODULES } from '../../modules/shared-imports';
import { FormControl, FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [MATERIAL, SHARED_MODULES, FormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  providers: [],
})
export class InputTextComponent {
  @Input() placeholder = '';

  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() errorMessage: string = '';
  @Input() selectControl: FormControl = new FormControl();
  @Input() isRequired: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hint: string = '';
  value: any = '';

  writeValue(value: any): void {
    this.value = value ?? '';
    if (this.isRequired) {
      this.selectControl.setValidators([Validators.required]);
    } else {
      this.selectControl.clearValidators();
    }
    this.selectControl.updateValueAndValidity();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
  }
  // Clear the input field
  clearInput(): void {
    this.value = '';
    this.selectControl.setValue('');
  }
}
