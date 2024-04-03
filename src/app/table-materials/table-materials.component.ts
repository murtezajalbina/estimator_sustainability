import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SelectedValuesService, TableUpdateService } from '../measures.service';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialRelatedMeasure } from '../material-related-measure';
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-table-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-materials.component.html',
  styleUrls: ['../app.component.css'],
  template: `
    <button (click)="sendData()">Send Data</button>
  `
})

export class TableMaterialsComponent implements OnInit {
 
  
  table: MaterialRelatedMeasure[] = [];
  currentRow: any;
  nextRowIndex = 1;

  years: number[] = Array.from({ length: 8 }, (_, index) => 2023 + index);
  percents: number[] = Array.from(
    { length: 10 },
    (_, index) => (index + 1) * 10
  );

  constructor(
    private selectedValuesService: SelectedValuesService,
    private tableUpdateService: TableUpdateService,
     // Hier fügen Sie den TableUpdateService hinzu
  ) {}
  

  ngOnInit() {
    this.currentRow = { material: '', measure: '', year: '', percent: '' };
  }

  addRow() {
    if (this.isCurrentRowValid()) {
      this.addRowToTable();
      this.currentRow = { material: '', measure: '', year: '', percent: '' };
    } else {
    }
  }

  addRowToTable() {
    if (this.isCurrentRowValid()) {
      const newMaterialRelatedMeasure: MaterialRelatedMeasure = {
        material: this.currentRow.material,
        measure: this.currentRow.measure,
        year: +this.currentRow.year, // Casting to number using unary plus operator
        percent: +this.currentRow.percent, // Casting to number using unary plus operator
      };
      this.table.push(newMaterialRelatedMeasure);
      this.tableUpdateService.emitRowAdded(this.table);
    } 
  }
  

  isCurrentRowValid(): boolean {
    if (
      !this.currentRow.material ||
      !this.currentRow.measure ||
      !this.currentRow.year ||
      !this.currentRow.percent
    ) {
      return false;
    }

    return true;
  }

  saveSelectedValues(selectedValue: any) {
    this.selectedValuesService.addSelectedValue(selectedValue);
  }
  
}
