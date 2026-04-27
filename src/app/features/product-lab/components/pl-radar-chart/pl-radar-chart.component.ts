import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PlRadarSeries {
  name: string;
  values: number[];
  dashed?: boolean;
  color: string;
}

@Component({
  selector: 'app-pl-radar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pl-radar-chart.component.html',
  styleUrls: ['./pl-radar-chart.component.scss'],
})
export class PlRadarChartComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() series: PlRadarSeries[] = [];
  /** ViewBox size */
  @Input() size = 280;

  viewBox = '0 0 280 280';
  cx = 140;
  cy = 140;
  maxR = 108;
  gridPolygons: string[] = [];
  axisLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  labelAnchors: Array<{ x: number; y: number; label: string; anchor: 'start' | 'middle' | 'end'; dy: number }> = [];
  pathDs: Array<{ d: string; name: string; color: string; dashed: boolean }> = [];

  ngOnChanges(ch: SimpleChanges): void {
    if (ch['labels'] || ch['series'] || ch['size']) {
      this.rebuild();
    }
  }

  private rebuild(): void {
    const n = this.labels.length;
    const s = this.size;
    this.viewBox = `0 0 ${s} ${s}`;
    this.cx = s / 2;
    this.cy = s / 2;
    this.maxR = s * 0.36;
    if (n < 3) {
      this.gridPolygons = [];
      this.axisLines = [];
      this.labelAnchors = [];
      this.pathDs = [];
      return;
    }

    const angles = Array.from({ length: n }, (_, i) => (-Math.PI / 2 + (2 * Math.PI * i) / n));
    const point = (r: number, i: number) => {
      const a = angles[i]!;
      return {
        x: this.cx + r * Math.cos(a),
        y: this.cy + r * Math.sin(a),
      };
    };

    this.gridPolygons = [0.25, 0.5, 0.75, 1].map((t) => {
      const pts = angles.map((_, i) => {
        const p = point(this.maxR * t, i);
        return `${p.x},${p.y}`;
      });
      return pts.join(' ');
    });

    this.axisLines = angles.map((_, i) => {
      const outer = point(this.maxR * 1.08, i);
      return { x1: this.cx, y1: this.cy, x2: outer.x, y2: outer.y };
    });

    const labelR = this.maxR * 1.22;
    this.labelAnchors = this.labels.map((label, i) => {
      const p = point(labelR, i);
      const deg = (angles[i]! * 180) / Math.PI;
      let anchor: 'start' | 'middle' | 'end' = 'middle';
      let dy = 4;
      if (deg > -110 && deg < -70) {
        anchor = 'middle';
        dy = -8;
      } else if (deg <= -90 || deg >= 90) {
        anchor = 'end';
      } else {
        anchor = 'start';
      }
      return { x: p.x, y: p.y, label, anchor, dy };
    });

    this.pathDs = this.series.map((ser) => {
      const vals = this.normalizeValues(ser.values, n);
      const pts = vals.map((v, i) => point((this.maxR * v) / 100, i));
      const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
      return { d, name: ser.name, color: ser.color, dashed: !!ser.dashed };
    });
  }

  private normalizeValues(values: number[], n: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < n; i++) {
      const raw = values[i];
      const num = typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
      out.push(Math.max(0, Math.min(100, num)));
    }
    return out;
  }
}
