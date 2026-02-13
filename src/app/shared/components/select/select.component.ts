import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MATERIAL, SHARED_MODULES } from '../../modules/shared-imports';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [MATERIAL, SHARED_MODULES, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [],
})
export class SelectComponent implements OnInit {
  @Input() label: string = '';
  @Input() options: any[] = [];
  @Input() selectControl: FormControl = new FormControl();
  @Input() isRequired: boolean = false;
  @Input() multiSelect: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hint: string = '';
  @Input() groupBy: boolean = false;

  @Output() valueChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    // Apply validators dynamically
    if (this.isRequired) {
      this.selectControl.setValidators([Validators.required]);
    } else {
      this.selectControl.clearValidators();
    }

    // Handle disabled state dynamically
    if (this.disabled) {
      this.selectControl.disable();
    } else {
      this.selectControl.enable();
    }

    this.selectControl.updateValueAndValidity();
  }

  onValueChange($event: MatSelectChange): void {
    this.valueChange.emit($event.value);
  }

  // Get the options for a specific group (if grouping is enabled)
  getOptionsByGroup(group: string): { value: string; viewValue: string }[] {
    return this.options
      .filter((option) => option.group === group)
      .map((option) => ({ value: option.value, viewValue: option.viewValue }));
  }
}
