import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderPage } from './shared/components/header-page/header.page';
import { FooterPage } from './shared/components/footer-page/footer-page';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderPage, FooterPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BarnaSpace');
}
