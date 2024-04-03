import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotSingleProductComponent } from './plot-single-product.component';

describe('PlotSingleProductComponent', () => {
  let component: PlotSingleProductComponent;
  let fixture: ComponentFixture<PlotSingleProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlotSingleProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlotSingleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
