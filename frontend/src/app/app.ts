import { Component, signal } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CurrenciesComponent } from './components/currencies/currencies.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrenciesComponent, HttpClientModule],
  template: '<app-currencies></app-currencies>',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');
}
