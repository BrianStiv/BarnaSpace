import { Component, input, contentChild, TemplateRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

export interface DetailField {
  label: string;
  value: string | number | string[] | undefined;
  type?: 'text' | 'list' | 'date';
}

export interface DetailSection {
  title?: string;
  fields: DetailField[];
}

@Component({
  selector: 'app-admin-detail-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, DatePipe],
  templateUrl: './admin-detail-panel.html',
})
export class AdminDetailPanel {
  sections = input<DetailSection[]>([]);
  emptyMessage = input<string>('Selecciona un item para ver el detalle');

  actionsTemplate = contentChild<TemplateRef<unknown>>('actions');

  asArray(value: unknown): string[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [String(value)];
  }
}
