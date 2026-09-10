import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminChartService } from '../../service/AdminChart.service';
import { chartPalette } from '../../../../core/utils/chart-colors';

@Component({
  selector: 'app-spaces-status-chart',
  imports: [BaseChartDirective, MatProgressSpinnerModule],
  template: `
    @if (data()) {
      <canvas baseChart
        [type]="'bar'"
        [data]="data()!"
        [options]="chartOptions">
      </canvas>
    } @else {
      <mat-spinner diameter="32" />
    }
  `,
})
export class SpacesStatusChart {
  private chartService = inject(AdminChartService);

  private result = toSignal(this.chartService.getSpacesByStatusCount(), { initialValue: null });

  data = computed<ChartData<'bar'> | null>(() => {
    const r = this.result();
    if (!r) return null;
    const p = chartPalette();
    return {
      labels: r.map((item) => item.status),
      datasets: [
        { data: r.map((item) => item.count), label: 'Espacios', backgroundColor: p.forest },
      ],
    };
  });

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: { 
      y: { beginAtZero: true, ticks: { precision: 0 } } },
  };
}