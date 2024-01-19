import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestD3PlotComponent } from './test-d3-plot.component';

describe('TestD3PlotComponent', () => {
  let component: TestD3PlotComponent;
  let fixture: ComponentFixture<TestD3PlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestD3PlotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestD3PlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
