import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { PlotEmissionsComponent } from './plot-emissions/plot-emissions.component.js';
import { PlotCostsComponent } from './plot-costs/plot-costs.component';
import { HttpClientModule } from '@angular/common/http';
import { PlotROIComponent } from './plot-roi/plot-roi.component';




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
    PlotROIComponent,
  ],
  templateUrl: './index.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dashboard';
}
