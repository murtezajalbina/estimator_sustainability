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
import { MaterialRelatedMeasure } from './material-related-measure';
import { PlotSingleProductComponent } from './plot-single-product/plot-single-product.component'

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
    TableMaterialsComponent,
    PlotSingleProductComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})


export class AppComponent {
  title = 'dashboard';
  dataToPass: MaterialRelatedMeasure[] | undefined;

  receiveData(data: MaterialRelatedMeasure[] ) {
    this.dataToPass = data;
  }
}
