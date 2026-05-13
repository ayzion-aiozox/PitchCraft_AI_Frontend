import { Pipe, PipeTransform } from '@angular/core';

/** Truncates long labels with an ellipsis (tables, cards). */
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength = 80, ellipsis = '…'): string {
    if (value == null || value === '') return '';
    if (value.length <= maxLength) return value;
    const end = Math.max(0, maxLength - ellipsis.length);
    return `${value.slice(0, end)}${ellipsis}`;
  }
}
