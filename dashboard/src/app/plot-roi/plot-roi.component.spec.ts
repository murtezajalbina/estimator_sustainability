import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotROIComponent } from './plot-roi.component';

describe('PlotROIComponent', () => {
  let component: PlotROIComponent;
  let fixture: ComponentFixture<PlotROIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlotROIComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlotROIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
