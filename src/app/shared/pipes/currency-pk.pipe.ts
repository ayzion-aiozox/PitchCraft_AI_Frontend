import { Pipe, PipeTransform } from '@angular/core';

/** Pakistani Rupee (PKR) display for dashboards and billing stubs. */
@Pipe({ name: 'currencyPk', standalone: true })
export class CurrencyPkPipe implements PipeTransform {
  transform(value: number | string | null | undefined, fractionDigits = 0): string {
    if (value === null || value === undefined || value === '') return '—';
    const n = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (!Number.isFinite(n)) return '—';
    try {
      return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(n);
    } catch {
      return `PKR ${n.toFixed(fractionDigits)}`;
    }
  }
}
