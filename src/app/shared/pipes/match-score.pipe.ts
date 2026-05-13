import { Pipe, PipeTransform } from '@angular/core';

/** Formats a 0–100 style match score for lists and badges (Prospect Hunter, etc.). */
@Pipe({ name: 'matchScore', standalone: true })
export class MatchScorePipe implements PipeTransform {
  transform(value: number | string | null | undefined, fractionDigits = 0): string {
    if (value === null || value === undefined || value === '') return '—';
    const n = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (!Number.isFinite(n)) return '—';
    const clamped = Math.max(0, Math.min(100, n));
    return `${clamped.toFixed(fractionDigits)}%`;
  }
}
