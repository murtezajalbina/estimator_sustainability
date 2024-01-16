import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostsWithMeasuresComponent } from './costs-with-measures.component';

describe('CostsWithMeasuresComponent', () => {
  let component: CostsWithMeasuresComponent;
  let fixture: ComponentFixture<CostsWithMeasuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostsWithMeasuresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CostsWithMeasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
