import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SelectedValuesService } from '../measures.service';
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
  @Output() dataEmitter = new EventEmitter<MaterialRelatedMeasure[]>();
 
  
  table: MaterialRelatedMeasure[] = [];
  currentRow: any;
  nextRowIndex = 1;

  years: number[] = Array.from({ length: 8 }, (_, index) => 2023 + index);
  percents: number[] = Array.from(
    { length: 10 },
    (_, index) => (index + 1) * 10
  );

  constructor(private selectedValuesService: SelectedValuesService) {}

  ngOnInit() {
    this.currentRow = { material: '', measure: '', year: '', percent: '', editable: true };
  }

  addRow() {
    if (this.isCurrentRowValid()) {
      this.addRowToTable();
      this.currentRow = { material: '', measure: '', year: '', percent: '', editable: true };
    } else {
    }
  }
  sendData(table: MaterialRelatedMeasure[]) {
    this.dataEmitter.emit(table);
    console.log(typeof table)
  }

  addRowToTable() {
    if (this.isCurrentRowValid()) {
      const newMaterialRelatedMeasure: MaterialRelatedMeasure = {
        material: this.currentRow.material,
        measure: this.currentRow.measure,
        year: this.currentRow.year,
        percent: this.currentRow.percent,
      };
      this.table.push(newMaterialRelatedMeasure);
      
      // Setze editable auf false, um die Zeile nicht mehr bearbeitbar zu machen
      this.currentRow.editable = false;

      
      this.sendData(this.table)
      console.log('Aktualisierte Tabelle:', this.table);
      
    } else {
      console.log('Bitte alle Optionen auswählen.');
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
