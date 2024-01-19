import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotCostsComponent } from './plot-costs.component';

describe('PlotCostsComponent', () => {
  let component: PlotCostsComponent;
  let fixture: ComponentFixture<PlotCostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlotCostsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlotCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
