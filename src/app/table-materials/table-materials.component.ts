import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-table-materials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-materials.component.html',
  styleUrl: './table-materials.component.css'
})
export class TableMaterialsComponent {
  headers = ['Reduce Waist', 'Process Efficiency', 'Reduce Waste', 'Green Compounds'];
  rows = [
    { name: 'Aluminum', toggles: [false, false, false, false] },
    { name: 'Stahl', toggles: [false, false, false, false] },
    { name: 'Other', toggles: [false, false, false, false] }
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
}
