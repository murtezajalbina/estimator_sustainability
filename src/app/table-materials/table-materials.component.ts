import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';



declare var $: any;

@Component({
  selector: 'app-table-materials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-materials.component.html',
  styleUrls: ['./table-materials.component.css']
})
export class TableMaterialsComponent implements AfterViewInit {
  headers = ['Reduce Waste', 'Process Efficiency', 'Switch technology', 'Green Compounds'];
  rows = [
    { name: 'Aluminum', toggles: [false, false, false, false], iconname: "bi bi-layers", color: "silver"},
    { name: 'Steel', toggles: [false, false, false, false], iconname: "bi bi-record2-fill", color: "purple" },
    { name: 'Other', toggles: [false, false, false, false], iconname: "bi bi-archive", color: "red" }
  ];

  toggleButton(rowName: string, colName: string) {
    const rowIndex = this.rows.findIndex(row => row.name === rowName);
    const colIndex = this.headers.findIndex(header => header === colName);
    this.rows[rowIndex].toggles[colIndex] = !this.rows[rowIndex].toggles[colIndex];
  }

  getToggleButtonValue(rowName: string, colName: string): boolean {
    const rowIndex = this.rows.findIndex(row => row.name === rowName);
    const colIndex = this.headers.findIndex(header => header === colName);
    return this.rows[rowIndex].toggles[colIndex];
  }

  ngAfterViewInit() {
    // Aktiviere die Bootstrap Toggle-Funktion nachdem die Ansicht initialisiert wurde
    return;
    /* $('[data-toggle="toggle"]').bootstrapToggle(); */
  }
}
