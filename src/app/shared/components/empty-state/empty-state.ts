import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  templateUrl: './empty-state.html',
})
export class EmptyState {
  title = input<string>('No hay resultados');
  message = input<string>('Prueba a cambiar los filtros de búsqueda.');
  icon = input<string>('search');
}
