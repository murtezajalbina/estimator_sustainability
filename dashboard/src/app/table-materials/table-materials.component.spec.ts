import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMaterialsComponent } from './table-materials.component';

describe('TableMaterialsComponent', () => {
  let component: TableMaterialsComponent;
  let fixture: ComponentFixture<TableMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableMaterialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
