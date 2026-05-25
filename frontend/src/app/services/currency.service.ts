import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {

    private apiUrl = 'http://localhost:8000';

    constructor(private http: HttpClient) { }

    getCurrencies() {
        return this.http.get(`${this.apiUrl}/currencies`);
    }

    getByDate(date: string) {
        return this.http.get(`${this.apiUrl}/currencies/${date}`);
    }

    fetchData() {
        return this.http.post(`${this.apiUrl}/currencies/fetch`, {});
    }
}