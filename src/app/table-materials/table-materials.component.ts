import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { ToggleService } from '../measures.service';




declare var $: any;

@Component({
  selector: 'app-table-materials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-materials.component.html',
  styleUrls: ['./table-materials.component.css']
})


export class TableMaterialsComponent implements AfterViewInit {
  
  constructor(private toggleService: ToggleService) {}

  headers = ['Reduce Waste', 'Process Efficiency', 'Switch technology', 'Green Compounds'];
  rows = [
    { name: 'Aluminum', toggles: [false, false, false, false], iconname: "bi bi-layers", color: "silver"},
    { name: 'Steel', toggles: [false, false, false, false], iconname: "bi bi-record2-fill", color: "purple" },
    { name: 'Other', toggles: [false, false, false, false], iconname: "bi bi-archive", color: "red" }
  ];

// Methoden anpassen
toggleButton(rowName: string, colName: string) {
  const toggles = this.toggleService.getToggles(rowName);
  const colIndex = this.headers.findIndex(header => header === colName);
  toggles[colIndex] = !toggles[colIndex];
  this.toggleService.setToggle(rowName, toggles);
/*   console.log('setting:', rowName, toggles)
 */}

getToggleButtonValue(rowName: string, colName: string): boolean {
  const toggles = this.toggleService.getToggles(rowName);
  const colIndex = this.headers.findIndex(header => header === colName);
  return toggles[colIndex];
}
  ngAfterViewInit() {
    // Aktiviere die Bootstrap Toggle-Funktion nachdem die Ansicht initialisiert wurde
    return;
    /* $('[data-toggle="toggle"]').bootstrapToggle(); */
  }
}
