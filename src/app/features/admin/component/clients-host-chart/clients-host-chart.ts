import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminChartService } from '../../service/AdminChart.service';
import { chartPalette } from '../../../../core/utils/chart-colors';

@Component({
  selector: 'app-clients-hosts-chart',
  imports: [BaseChartDirective, MatProgressSpinnerModule],
  template: `
    @if (data()) {
      <canvas baseChart
        [type]="'doughnut'"
        [data]="data()!"
        [options]="chartOptions">
      </canvas>
    } @else {
      <mat-spinner diameter="32" />
    }
  `,
})
export class ClientsHostsChart {
  private chartService = inject(AdminChartService);
  private result = toSignal(this.chartService.getUsersByRole(), { initialValue: null });

  data = computed<ChartData<'doughnut'> | null>(() => {
    const r = this.result();
    if (!r) return null;
    const p = chartPalette();
    return {
      labels: ['Clientes', 'Anfitriones'],
      datasets: [
        { 
          data: [r.clients, r.hosts], 
          backgroundColor: [p.terracota, p.forest],
          radius: '70%',},
      ],
    };
  });

  chartOptions: ChartOptions<'doughnut'> = { responsive: true };
}