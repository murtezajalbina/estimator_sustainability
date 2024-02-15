import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-plot-costs',
  standalone: true,
  imports: [],
  templateUrl: './plot-costs.component.html',
  styleUrl: './plot-costs.component.css'
})
export class PlotCostsComponent {

  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.createLinePlot();
  }

  private createLinePlot(): void {
    const data = require("../data/dummy-data-costs.json")
 
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Datenverarbeitung und Linienplot-Logik hier hinzufügen
    // Beispielcode für eine einfache Linie:

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.volume));

    // Beispiel: Daten filtern für das erste Produkt
    const productData = data[0].sales[0];

    x.domain(d3.extent(productData, d => d.year) as [number, number]);
    y.domain([0, d3.max(productData, d => d.volume) as number]);

    svg.append('path')
      .datum(productData)
      .attr('class', 'line')
      .attr('d', line);
  }

}