import { Pipe, PipeTransform } from '@angular/core';

/** Relative time from a date (pure transform; re-evaluate via async or signal if live updates needed). */
@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined): string {
    if (value === null || value === undefined) return '—';
    const t = value instanceof Date ? value.getTime() : new Date(value).getTime();
    if (!Number.isFinite(t)) return '—';

    const diffSec = Math.round((t - Date.now()) / 1000);
    const abs = Math.abs(diffSec);
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

    if (abs < 60) return rtf.format(Math.round(diffSec), 'second');
    if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
    if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
    if (abs < 86400 * 30) return rtf.format(Math.round(diffSec / 86400), 'day');
    if (abs < 86400 * 365) return rtf.format(Math.round(diffSec / (86400 * 30)), 'month');
    return rtf.format(Math.round(diffSec / (86400 * 365)), 'year');
  }
}
