import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotEmissionsComponent } from './plot-emissions.component';

describe('PlotEmissionsComponent', () => {
  let component: PlotEmissionsComponent;
  let fixture: ComponentFixture<PlotEmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlotEmissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlotEmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
