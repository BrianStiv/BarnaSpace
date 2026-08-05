import { Component, input, output, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface AdminTableColumn<T> {
  key: keyof T;
  label: string;
}

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [MatTableModule, MatProgressSpinnerModule],
  templateUrl: './admin-table.html',
})
export class AdminTable<T extends Record<string, any>> {
  columns = input.required<AdminTableColumn<T>[]>();
  data = input<T[]>([]);
  loading = input<boolean>(false);

  rowClick = output<T>();

  displayedColumns = computed(() => this.columns().map(c => c.key as string));

  onRowClick(row: T) {
    this.rowClick.emit(row);
  }
}