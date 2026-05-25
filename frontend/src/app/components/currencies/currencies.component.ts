import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';

type FilterType = 'year' | 'quarter' | 'month' | 'day';

@Component({
    selector: 'app-currencies',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './currencies.component.html'
})
export class CurrenciesComponent {

    currencies: any[] = [];
    filteredCurrencies: any[] = [];
    date: string = '';
    filterType: FilterType = 'year';

    selectedYear = '';
    selectedQuarter = '';
    selectedMonth = '';
    selectedDay = '';
    years: string[] = [];
    quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    months = [
        { value: '01', label: 'Styczeń' },
        { value: '02', label: 'Luty' },
        { value: '03', label: 'Marzec' },
        { value: '04', label: 'Kwiecień' },
        { value: '05', label: 'Maj' },
        { value: '06', label: 'Czerwiec' },
        { value: '07', label: 'Lipiec' },
        { value: '08', label: 'Sierpień' },
        { value: '09', label: 'Wrzesień' },
        { value: '10', label: 'Październik' },
        { value: '11', label: 'Listopad' },
        { value: '12', label: 'Grudzień' }
    ];
    days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
    loading = false;
    error = '';

    constructor(private service: CurrencyService) { }

    loadCurrencies() {
        this.loading = true;
        this.error = '';

        this.service.getCurrencies().subscribe({
            next: (data: any) => {
                this.currencies = data;
                this.filteredCurrencies = [...data];
                this.updateYears();
                this.applyFilter();
                this.loading = false;
            },
            error: () => {
                this.error = 'Nie można pobrać danych.';
                this.loading = false;
            }
        });
    }

    loadByDate(dateParam?: string) {
        const dateToUse = dateParam ?? this.date;
        if (!dateToUse) {
            this.error = 'Podaj datę w formacie YYYY-MM-DD.';
            return;
        }

        this.loading = true;
        this.error = '';

        this.service.getByDate(dateToUse).subscribe({
            next: (data: any) => {
                this.currencies = data;
                this.filteredCurrencies = [...data];
                this.updateYears();
                this.applyFilter();
                this.loading = false;
            },
            error: () => {
                this.error = 'Nie można pobrać danych dla wybranej daty.';
                this.loading = false;
            }
        });
    }

    fetchFromNBP() {
        this.loading = true;
        this.error = '';

        this.service.fetchData().subscribe({
            next: () => this.loadCurrencies(),
            error: () => {
                this.error = 'Błąd podczas pobierania kursów z NBP.';
                this.loading = false;
            }
        });
    }

    onClickLoadCurrencies() {
        requestAnimationFrame(() => this.loadCurrencies());
    }

    onClickFetchFromNBP() {
        requestAnimationFrame(() => this.fetchFromNBP());
    }

    setFilter(filter: FilterType) {
        this.filterType = filter;
        this.applyFilter();
    }

    applyFilter() {
        if (!this.currencies.length) {
            this.filteredCurrencies = [];
            return;
        }

        const records = [...this.currencies];

        switch (this.filterType) {
            case 'year':
                this.filteredCurrencies = this.selectedYear
                    ? records.filter(c => new Date(c.date).getFullYear().toString() === this.selectedYear)
                    : records;
                break;
            case 'quarter':
                this.filteredCurrencies = this.selectedQuarter
                    ? records.filter(c => this.getQuarter(new Date(c.date)) === this.selectedQuarter)
                    : records;
                break;
            case 'month':
                this.filteredCurrencies = this.selectedMonth
                    ? records.filter(c => this.getMonth(c.date) === this.selectedMonth)
                    : records;
                break;
            case 'day':
                this.filteredCurrencies = this.selectedDay
                    ? records.filter(c => this.getDay(c.date) === this.selectedDay)
                    : records;
                break;
        }
    }

    resetFilter() {
        this.selectedYear = '';
        this.selectedQuarter = '';
        this.selectedMonth = '';
        this.selectedDay = '';
        this.filteredCurrencies = [...this.currencies];
    }

    updateYears() {
        this.years = Array.from(new Set(this.currencies.map(c => new Date(c.date).getFullYear().toString()))).sort();
    }

    getQuarter(date: Date) {
        const month = date.getMonth() + 1;
        if (month <= 3) return 'Q1';
        if (month <= 6) return 'Q2';
        if (month <= 9) return 'Q3';
        return 'Q4';
    }

    getMonth(dateValue: string) {
        return dateValue.substring(5, 7);
    }

    getDay(dateValue: string) {
        // expects ISO date string like YYYY-MM-DD
        return dateValue.substring(8, 10);
    }
}