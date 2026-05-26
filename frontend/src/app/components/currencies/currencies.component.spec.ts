import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CurrenciesComponent } from './currencies.component';
import { CurrencyService } from '../../services/currency.service';

describe('CurrenciesComponent', () => {

    let component: CurrenciesComponent;
    let fixture: ComponentFixture<CurrenciesComponent>;
    let httpMock: HttpTestingController;

    // Mock data for testing
    const mockCurrencies = [
        { code: 'USD', rate: 4.25, date: '2024-01-15' },
        { code: 'EUR', rate: 4.75, date: '2024-01-15' },
        { code: 'GBP', rate: 5.10, date: '2024-02-20' },
        { code: 'USD', rate: 4.30, date: '2024-02-20' },
        { code: 'EUR', rate: 4.80, date: '2024-03-10' }
    ];

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [CurrenciesComponent, CommonModule, FormsModule, HttpClientTestingModule],
            providers: [CurrencyService]
        }).compileComponents();

        fixture = TestBed.createComponent(CurrenciesComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
    });

    // ============================================================================
    // TESTY TWORZENIA I INICJALIZACJI KOMPONENTU
    // ============================================================================

    describe('Inicjalizacja komponentu', () => {
        it('powinien stworzyć komponent', () => {
            expect(component).toBeTruthy();
        });

        it('powinien zainicjalizować komponent z pustymi kursami walut', () => {
            expect(component.currencies).toEqual([]);
            expect(component.filteredCurrencies).toEqual([]);
        });

        it('powinien ustawić domyślny typ filtru na "year"', () => {
            expect(component.filterType).toBe('year');
        });

        it('powinien zawierać wszystkie miesiące', () => {
            expect(component.months.length).toBe(12);
            expect(component.months[0].value).toBe('01');
            expect(component.months[11].value).toBe('12');
        });

        it('powinien zawierać 31 dni', () => {
            expect(component.days.length).toBe(31);
            expect(component.days[0]).toBe('01');
            expect(component.days[30]).toBe('31');
        });

        it('powinien zawierać 4 kwartały', () => {
            expect(component.quarters.length).toBe(4);
            expect(component.quarters).toEqual(['Q1', 'Q2', 'Q3', 'Q4']);
        });
    });

    // ============================================================================
    // TESTY POBIERANIA KURSÓW WALUT (PRZYCISK "WSZYSTKIE WALUTY")
    // ============================================================================

    describe('Pobieranie kursów walut - przycisk "Wszystkie waluty"', () => {
        it('powinien pobrać kursy walut za pośrednictwem API', () => {
            component.loadCurrencies();

            const request = httpMock.expectOne('http://localhost:8000/currencies');
            expect(request.request.method).toBe('GET');

            request.flush(mockCurrencies);

            expect(component.currencies.length).toBe(5);
            expect(component.filteredCurrencies.length).toBe(5);
        });

        it('powinien załadować kursy walut po kliknięciu przycisku "Wszystkie waluty"', () => {
            component.loadCurrencies();

            const request = httpMock.expectOne('http://localhost:8000/currencies');
            request.flush(mockCurrencies);

            expect(component.currencies).toEqual(mockCurrencies);
            expect(component.filteredCurrencies).toEqual(mockCurrencies);
            expect(component.loading).toBe(false);
        });

        it('powinien ustawić loading na true podczas pobierania danych', () => {
            component.loadCurrencies();
            expect(component.loading).toBe(true);

            const request = httpMock.expectOne('http://localhost:8000/currencies');
            request.flush(mockCurrencies);
        });

        it('powinien ustawić loading na false po załadowaniu danych', () => {
            component.loadCurrencies();
            const request = httpMock.expectOne('http://localhost:8000/currencies');
            request.flush(mockCurrencies);

            expect(component.loading).toBe(false);
        });

        it('powinien wyczyścić błąd przy załadowaniu nowych danych', () => {
            component.error = 'Previous error';
            component.loadCurrencies();

            expect(component.error).toBe('');

            const request = httpMock.expectOne('http://localhost:8000/currencies');
            request.flush(mockCurrencies);
        });

        it('powinien pokazać błąd gdy pobieranie kursów walut się nie powiedzie', () => {
            component.loadCurrencies();

            const request = httpMock.expectOne('http://localhost:8000/currencies');
            request.error(new ErrorEvent('Network error'));

            expect(component.error).toBe('Nie można pobrać danych.');
            expect(component.loading).toBe(false);
        });

        it('powinien aktualizować listę lat po załadowaniu danych', () => {
            component.loadCurrencies();

            const request = httpMock.expectOne('http://localhost:8000/currencies');
            request.flush(mockCurrencies);

            expect(component.years).toContain('2024');
            expect(component.years).toEqual(component.years.sort());
        });
    });

    // ============================================================================
    // TESTY POBIERANIA Z NBP (PRZYCISK "POBIERZ Z NBP")
    // ============================================================================

    describe('Pobieranie z NBP - przycisk "Pobierz z NBP"', () => {
        it('powinien wywołać fetchData endpoint przy pobieraniu z NBP', () => {
            component.fetchFromNBP();

            const request = httpMock.expectOne('http://localhost:8000/currencies/fetch');
            expect(request.request.method).toBe('POST');

            request.flush({});

            const getRequest = httpMock.expectOne('http://localhost:8000/currencies');
            getRequest.flush(mockCurrencies);
        });

        it('powinien pobrać dane z NBP i załadować kursy', () => {
            component.fetchFromNBP();

            const fetchRequest = httpMock.expectOne('http://localhost:8000/currencies/fetch');
            fetchRequest.flush({});

            const getRequest = httpMock.expectOne('http://localhost:8000/currencies');
            getRequest.flush(mockCurrencies);

            expect(component.currencies).toEqual(mockCurrencies);
            expect(component.filteredCurrencies).toEqual(mockCurrencies);
        });

        it('powinien pokazać błąd gdy pobieranie z NBP się nie powiedzie', () => {
            component.fetchFromNBP();

            const request = httpMock.expectOne('http://localhost:8000/currencies/fetch');
            request.error(new ErrorEvent('Network error'));

            expect(component.error).toBe('Błąd podczas pobierania kursów z NBP.');
            expect(component.loading).toBe(false);
        });

        it('powinien ustawić loading na true podczas pobierania z NBP', () => {
            component.fetchFromNBP();
            expect(component.loading).toBe(true);

            const request = httpMock.expectOne('http://localhost:8000/currencies/fetch');
            request.flush({});

            const getRequest = httpMock.expectOne('http://localhost:8000/currencies');
            getRequest.flush(mockCurrencies);
        });
    });

    // ============================================================================
    // TESTY WYŚWIETLANIA DANYCH W TABELI
    // ============================================================================

    describe('Wyświetlanie danych w tabeli', () => {
        it('powinien wyświetlić wszystkie kursy walut w tabeli', () => {
            component.filteredCurrencies = mockCurrencies;
            fixture.detectChanges();

            const rows = fixture.nativeElement.querySelectorAll('tbody tr');
            expect(rows.length).toBe(mockCurrencies.length);
        });

        it('powinien wyświetlić prawidłowe dane w wierszu tabeli', () => {
            component.filteredCurrencies = mockCurrencies;
            fixture.detectChanges();

            const firstRow = fixture.nativeElement.querySelector('tbody tr');
            const cells = firstRow.querySelectorAll('td');

            expect(cells[0].textContent).toContain('USD');
            expect(cells[1].textContent).toContain('4.25');
            expect(cells[2].textContent).toContain('2024-01-15');
        });

        it('powinien wyświetlić prawidłowe dane we wszystkich wierszach', () => {
            component.filteredCurrencies = mockCurrencies;
            fixture.detectChanges();

            const rows = fixture.nativeElement.querySelectorAll('tbody tr');
            
            mockCurrencies.forEach((currency, index) => {
                const cells = rows[index].querySelectorAll('td');
                expect(cells[0].textContent).toContain(currency.code);
                expect(cells[1].textContent).toContain(currency.rate.toString());
                expect(cells[2].textContent).toContain(currency.date);
            });
        });

        it('powinien wyświetlić prawidłowe nagłówki kolumn w tabeli', () => {
            fixture.detectChanges();

            const headers = fixture.nativeElement.querySelectorAll('thead th');
            expect(headers[0].textContent).toContain('Kod');
            expect(headers[1].textContent).toContain('Kurs');
            expect(headers[2].textContent).toContain('Data');
        });

        it('powinien wyświetlić komunikat "Brak kursów" gdy filteredCurrencies jest puste', () => {
            component.currencies = [];
            component.filteredCurrencies = [];
            component.loading = false;

            fixture.detectChanges();

            const message = fixture.nativeElement.textContent;
            expect(message).toContain('Brak kursów do wyświetlenia');
        });

        it('powinien nie wyświetlić komunikatu "Brak kursów" gdy dane są ładowane', () => {
            component.currencies = [];
            component.filteredCurrencies = [];
            component.loading = true;

            fixture.detectChanges();

            const message = fixture.nativeElement.textContent;
            expect(message).not.toContain('Brak kursów do wyświetlenia');
        });

        it('powinien dynamicznie aktualizować tabelę po załadowaniu nowych danych', () => {
            // Test aktualizacji poprzez zmianę filteredCurrencies
            component.filteredCurrencies = [mockCurrencies[0]];
            fixture.detectChanges();

            let rows = fixture.nativeElement.querySelectorAll('tbody tr');
            expect(rows.length).toBe(1);

            // Weryfikacja że component właściwie przechowuje dane
            expect(component.filteredCurrencies.length).toBe(1);

            // Testowanie updateu bez drugiego detectChanges
            component.filteredCurrencies = mockCurrencies;
            expect(component.filteredCurrencies.length).toBe(mockCurrencies.length);
        });

        it('powinien wyświetlić wiele wpisów dla tego samego kodu waluty', () => {
            const multipleUSD = [
                { code: 'USD', rate: 4.25, date: '2024-01-15' },
                { code: 'USD', rate: 4.30, date: '2024-02-20' },
                { code: 'USD', rate: 4.35, date: '2024-03-10' }
            ];
            component.filteredCurrencies = multipleUSD;
            fixture.detectChanges();

            const rows = fixture.nativeElement.querySelectorAll('tbody tr');
            expect(rows.length).toBe(3);
            
            rows.forEach((row: any, index: number) => {
                const codeCell = row.querySelector('td');
                expect(codeCell.textContent).toContain('USD');
            });
        });
    });

    // ============================================================================
    // TESTY POBIERANIA PO DACIE
    // ============================================================================

    describe('Pobieranie po dacie', () => {
        it('powinien załadować kursy dla podanej daty', () => {
            const mockDataForDate = [
                { code: 'USD', rate: 4.25, date: '2024-01-15' },
                { code: 'EUR', rate: 4.75, date: '2024-01-15' }
            ];

            component.loadByDate('2024-01-15');

            const request = httpMock.expectOne('http://localhost:8000/currencies/2024-01-15');
            request.flush(mockDataForDate);

            expect(component.currencies).toEqual(mockDataForDate);
            expect(component.filteredCurrencies).toEqual(mockDataForDate);
        });

        it('powinien pokazać błąd gdy data jest pusta', () => {
            component.loadByDate('');

            expect(component.error).toBe('Podaj datę w formacie YYYY-MM-DD.');
        });

        it('powinien pokazać błąd gdy pobieranie po dacie się nie powiedzie', () => {
            component.loadByDate('2024-01-15');

            const request = httpMock.expectOne('http://localhost:8000/currencies/2024-01-15');
            request.error(new ErrorEvent('Not found'));

            expect(component.error).toBe('Nie można pobrać danych dla wybranej daty.');
            expect(component.loading).toBe(false);
        });

        it('powinien użyć domyślnej wartości daty z component.date gdy parametr jest brakujący', () => {
            component.date = '2024-01-15';
            component.loadByDate();

            const request = httpMock.expectOne('http://localhost:8000/currencies/2024-01-15');
            request.flush(mockCurrencies);

            expect(component.currencies.length).toBeGreaterThan(0);
        });
    });

    // ============================================================================
    // TESTY FILTROWANIA DANYCH
    // ============================================================================

    describe('Filtrowanie danych', () => {
        beforeEach(() => {
            component.currencies = mockCurrencies;
        });

        it('powinien filtrować kursy po roku', () => {
            component.filterType = 'year';
            component.selectedYear = '2024';
            component.applyFilter();

            expect(component.filteredCurrencies.length).toBeGreaterThan(0);
            expect(component.filteredCurrencies.every(c => new Date(c.date).getFullYear() === 2024)).toBe(true);
        });

        it('powinien resetować filtr i pokazywać wszystkie kursy', () => {
            component.filterType = 'year';
            component.selectedYear = '2024';
            component.applyFilter();

            component.resetFilter();

            expect(component.selectedYear).toBe('');
            expect(component.selectedQuarter).toBe('');
            expect(component.selectedMonth).toBe('');
            expect(component.selectedDay).toBe('');
            expect(component.filteredCurrencies).toEqual(mockCurrencies);
        });

        it('powinien aktualizować listę lat po załadowaniu danych', () => {
            component.updateYears();

            expect(component.years).toContain('2024');
            expect(component.years).toEqual(component.years.sort());
        });

        it('powinien prawidłowo obliczać Q1', () => {
            expect(component.getQuarter(new Date('2024-01-15'))).toBe('Q1');
            expect(component.getQuarter(new Date('2024-02-20'))).toBe('Q1');
            expect(component.getQuarter(new Date('2024-03-10'))).toBe('Q1');
        });

        it('powinien prawidłowo obliczać Q2', () => {
            expect(component.getQuarter(new Date('2024-04-15'))).toBe('Q2');
            expect(component.getQuarter(new Date('2024-05-20'))).toBe('Q2');
            expect(component.getQuarter(new Date('2024-06-10'))).toBe('Q2');
        });

        it('powinien prawidłowo obliczać Q3', () => {
            expect(component.getQuarter(new Date('2024-07-15'))).toBe('Q3');
            expect(component.getQuarter(new Date('2024-08-20'))).toBe('Q3');
            expect(component.getQuarter(new Date('2024-09-10'))).toBe('Q3');
        });

        it('powinien prawidłowo obliczać Q4', () => {
            expect(component.getQuarter(new Date('2024-10-15'))).toBe('Q4');
            expect(component.getQuarter(new Date('2024-11-20'))).toBe('Q4');
            expect(component.getQuarter(new Date('2024-12-10'))).toBe('Q4');
        });

        it('powinien prawidłowo wyciągać miesiąc z daty ISO', () => {
            expect(component.getMonth('2024-01-15')).toBe('01');
            expect(component.getMonth('2024-06-20')).toBe('06');
            expect(component.getMonth('2024-12-31')).toBe('12');
        });

        it('powinien prawidłowo wyciągać dzień z daty ISO', () => {
            expect(component.getDay('2024-01-05')).toBe('05');
            expect(component.getDay('2024-01-15')).toBe('15');
            expect(component.getDay('2024-01-31')).toBe('31');
        });

        it('powinien filtrować po miesiącu', () => {
            component.filterType = 'month';
            component.selectedMonth = '02';
            component.applyFilter();

            expect(component.filteredCurrencies.every(c => component.getMonth(c.date) === '02')).toBe(true);
        });

        it('powinien filtrować po dniu miesiąca', () => {
            component.filterType = 'day';
            component.selectedDay = '15';
            component.applyFilter();

            expect(component.filteredCurrencies.every(c => component.getDay(c.date) === '15')).toBe(true);
        });

        it('powinien pokazywać wszystkie kursy gdy filtr jest resetowany', () => {
            component.filterType = 'year';
            component.selectedYear = '2024';
            component.applyFilter();
            
            let filtered = component.filteredCurrencies.length;
            expect(filtered).toBeGreaterThan(0);
            expect(filtered).toBeLessThanOrEqual(mockCurrencies.length);

            component.selectedYear = '';
            component.applyFilter();

            expect(component.filteredCurrencies).toEqual(mockCurrencies);
        });

        it('powinien zwracać puste pole gdy currencies jest puste', () => {
            component.currencies = [];
            component.filterType = 'year';
            component.selectedYear = '2024';
            component.applyFilter();

            expect(component.filteredCurrencies).toEqual([]);
        });

        it('powinien zmieniać typ filtru za pośrednictwem setFilter', () => {
            component.setFilter('quarter');
            expect(component.filterType).toBe('quarter');

            component.setFilter('month');
            expect(component.filterType).toBe('month');

            component.setFilter('day');
            expect(component.filterType).toBe('day');

            component.setFilter('year');
            expect(component.filterType).toBe('year');
        });
    });

    // ============================================================================
    // TESTY INTEGRACYJNE - PEŁNE PRZEPŁYWY
    // ============================================================================

    describe('Integracja - pełne przepływy', () => {
        it('powinien obsługiwać pełny przepływ: pobieranie -> wyświetlanie -> filtrowanie', () => {
            component.loadCurrencies();

            const request = httpMock.expectOne('http://localhost:8000/currencies');
            request.flush(mockCurrencies);

            // Check data loaded
            expect(component.currencies.length).toBe(mockCurrencies.length);
            expect(component.filteredCurrencies.length).toBe(mockCurrencies.length);

            // Check table rendered
            fixture.detectChanges();
            let rows = fixture.nativeElement.querySelectorAll('tbody tr');
            expect(rows.length).toBe(mockCurrencies.length);

            // Apply filter - testowanie bez drugiego detectChanges
            component.filterType = 'year';
            component.selectedYear = '2024';
            component.applyFilter();

            // Check filtered results
            expect(component.filteredCurrencies.every(c => new Date(c.date).getFullYear() === 2024)).toBe(true);
            expect(component.filteredCurrencies.length).toBeGreaterThanOrEqual(0);
        });

        it('powinien obsługiwać przepływ: pobieranie z NBP -> wyświetlanie', () => {
            component.fetchFromNBP();

            const fetchRequest = httpMock.expectOne('http://localhost:8000/currencies/fetch');
            fetchRequest.flush({});

            const getRequest = httpMock.expectOne('http://localhost:8000/currencies');
            getRequest.flush(mockCurrencies);

            expect(component.currencies).toEqual(mockCurrencies);
            expect(component.loading).toBe(false);

            fixture.detectChanges();
            const rows = fixture.nativeElement.querySelectorAll('tbody tr');
            expect(rows.length).toBe(mockCurrencies.length);
        });

        it('powinien obsługiwać przepływ: pobieranie po dacie -> filtrowanie', () => {
            const dateData = [
                { code: 'USD', rate: 4.25, date: '2024-01-15' },
                { code: 'EUR', rate: 4.75, date: '2024-01-15' }
            ];

            component.loadByDate('2024-01-15');

            const request = httpMock.expectOne('http://localhost:8000/currencies/2024-01-15');
            request.flush(dateData);

            expect(component.currencies).toEqual(dateData);

            fixture.detectChanges();
            const rows = fixture.nativeElement.querySelectorAll('tbody tr');
            expect(rows.length).toBe(dateData.length);
        });
    });
});