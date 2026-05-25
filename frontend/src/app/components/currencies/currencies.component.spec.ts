import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrenciesComponent } from './currencies.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CurrenciesComponent', () => {

    let component: CurrenciesComponent;
    let fixture: ComponentFixture<CurrenciesComponent>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            declarations: [CurrenciesComponent],
            imports: [HttpClientTestingModule]
        }).compileComponents();

        fixture = TestBed.createComponent(CurrenciesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('given empty data when loadCurrencies then array exists', () => {
        component.loadCurrencies();
        expect(component.currencies).toBeDefined();
    });

    it('given date when loadByDate then function runs', () => {
        component.date = '2026-01-01';
        component.loadByDate();
        expect(component.date).toBe('2026-01-01');
    });
});