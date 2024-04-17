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
import { arrayBuffer } from 'stream/consumers';
import * as XLSX from 'xlsx';
import { forEach } from 'lodash';

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
  excelData:any;
  dataToPass: MaterialRelatedMeasure[] | undefined;

  receiveData(data: MaterialRelatedMeasure[] ) {
    this.dataToPass = data;
  }

  onFileChange(event:any){
    const file= event.target.files[0];
    const fileReader = new FileReader(); 

    fileReader.readAsArrayBuffer(file);

    fileReader.onload =(e:any) =>{
      const workbook = XLSX.read(fileReader.result,{type:'binary'})
      const sheetNames = workbook.SheetNames;

      this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      console.log(this.excelData)
    }
  }

}
