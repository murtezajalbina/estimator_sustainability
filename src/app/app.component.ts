import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { PlotEmissionsComponent } from './plot-emissions/plot-emissions.component.js';
import { PlotCostsComponent } from './plot-costs/plot-costs.component';
import { HttpClientModule } from '@angular/common/http';
import { PlotROIComponent } from './plot-roi/plot-roi.component';
import { ProductChoiceComponent } from './product-choice/product-choice.component';
import { TableMaterialsComponent } from './table-materials/table-materials.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    HttpClientModule, 
    HeaderComponent, 
    PlotEmissionsComponent,
    PlotCostsComponent,
    ProductChoiceComponent,
    PlotROIComponent,
    TableMaterialsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `
  <app-table-materials (dataEmitter)="receiveData($event)"></app-table-materials>
  <app-plot-emissions [receivedData]="dataToPass"></app-plot-emissions>
`

})


export class AppComponent {
  title = 'dashboard';
  dataToPass: string | undefined;

  receiveData(data: string) {
    this.dataToPass = data;
  }
}
