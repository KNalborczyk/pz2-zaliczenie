import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrenciesComponent } from './currencies.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CurrenciesComponent', () => {

    let component: CurrenciesComponent;
    let fixture: ComponentFixture<CurrenciesComponent>;
    let httpMock: HttpTestingController;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [CurrenciesComponent, HttpClientTestingModule]
        }).compileComponents();

        fixture = TestBed.createComponent(CurrenciesComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch currencies when loadCurrencies is called', () => {
        component.loadCurrencies();

        const request = httpMock.expectOne('http://localhost:8000/currencies');
        expect(request.request.method).toBe('GET');

        request.flush([
            { code: 'USD', rate: 4.5, date: '2025-01-01' },
            { code: 'EUR', rate: 4.7, date: '2025-01-02' }
        ]);

        expect(component.currencies.length).toBe(2);
        expect(component.filteredCurrencies.length).toBe(2);
        expect(component.years).toEqual(['2025']);
    });

    it('should render currency rows in the table', () => {
        component.filteredCurrencies = [
            { code: 'USD', rate: 4.5, date: '2025-01-01' },
            { code: 'EUR', rate: 4.7, date: '2025-01-02' }
        ];

        fixture.detectChanges();

        const rows = fixture.nativeElement.querySelectorAll('tbody tr');
        expect(rows.length).toBe(2);
        expect(rows[0].textContent).toContain('USD');
        expect(rows[0].textContent).toContain('4.5');
        expect(rows[1].textContent).toContain('EUR');
    });
});