import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';

@Component({
    selector: 'app-currencies',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './currencies.component.html'
})
export class CurrenciesComponent {

    currencies: any[] = [];
    date: string = '';

    constructor(private service: CurrencyService) { }

    loadCurrencies() {
        this.service.getCurrencies().subscribe((data: any) => {
            this.currencies = data;
        });
    }

    loadByDate() {
        this.service.getByDate(this.date).subscribe((data: any) => {
            this.currencies = data;
        });
    }

    fetchFromNBP() {
        this.service.fetchData().subscribe(() => {
            this.loadCurrencies();
        });
    }
}