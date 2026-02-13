import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL, SHARED_MODULES } from '../../modules/shared-imports';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-date-time',
  standalone: true,
  imports: [MATERIAL, SHARED_MODULES, ReactiveFormsModule, MatDatepickerModule],
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
})
export class DateTimeComponent {
  @Input() label: string = ''; // Label for the date-time picker
  @Input() placeholder: string = ''; // Placeholder text
  @Input() dateControl: FormControl = new FormControl(); // Date FormControl
  @Input() minDate: Date | null = null; // Minimum date allowed
  @Input() maxDate: Date | null = null; // Maximum date allowed
  @Input() dateFormat: string = 'MM/DD/YYYY'; // Default date format
  @Input() isRangePicker: boolean = false; // Whether to use a range picker
  @Input() disabled: boolean = false; // Disable the picker
  @Input() required: boolean = false; // Whether the date is required
  @Input() startAt: Date | null = null; // Start date for the picker
  @Output() dateChange = new EventEmitter<any>(); // Emit changes to the parent

  constructor() {}

  onDateChange(event: any): void {
    this.dateChange.emit(event.value);
  }
}
