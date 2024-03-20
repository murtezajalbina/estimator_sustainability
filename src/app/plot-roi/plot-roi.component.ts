import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataServiceEmissions, DataServiceColors, SelectedItemService } from '../cart.service'; //service for injecting data


@Component({
  selector: 'app-plot-roi',
  standalone: true,
  imports: [],
  templateUrl: './plot-roi.component.html',
  styleUrls: ['../app.component.css']
})

export class PlotROIComponent implements OnInit {
  colorPalette: string[] = []; 
  selectedItem: string = 'default';


  constructor(
    private dataService: DataServiceEmissions,
    private dataColors: DataServiceColors,
    private selectedItemService: SelectedItemService,
  ) {}

  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  ngOnInit(): void {
    this.selectedItemService.selectedItem$.subscribe((selectedItem) => {
      this.selectedItem = selectedItem;
      this.plotChart(this.selectedItem);
    });

     this.dataColors.getData().subscribe((color) => {
      this['colorPalette'] = color;
    });

    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    this.selectedItemService.selectedItem$.subscribe((selectedItem) => {
      this.selectedItem = selectedItem;
      this.plotChart(this.selectedItem);
    });

    this.dataColors.getData().subscribe((colorPalette) => {
      
      this.colorPalette = colorPalette;
      this.plotChart(this.selectedItem); 
    });
  }

  
  private plotChart(selectedItem: string): void {
     let years: number[];
     let revenues: number[];
     let netProfits: number[];

    if (selectedItem == 'Drive 1'){
     years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
     revenues = [10000, 12000, 15000, 7000, 20000, 6000, 5555, 9000, 0, 0, 0];
     netProfits = [5000, 12000, 15000, 18000, 46343, 6000, 38000, 9000, 0, 0, 0];
    } 
    else {
     years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
     revenues = [6000, 10000, 15000, 7000, 20000, 6000, 5555, 9000, 0, 0, 0];
     netProfits = [6000, 12000, 12000, 20000, 46343, 5000, 6000, 9000, 0, 9000, 0];
    }

  
    const margin = { top: 60, right: 50, bottom: 80, left: 90 };
    const width = 450 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
  
    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + 200)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
    this.createLegend(svg, ['Revenue', 'Net Profit'], [this.colorPalette[2], 'red']);
    const data = years.map((year, index) => ({
      year,
      revenue: revenues[index],
      netProfit: netProfits[index],
    }));
    const xScale = d3
      .scaleBand()
      .domain(years.map(String))
      .range([0, width])
      .padding(0.1);
  
    const maxRevenue = d3.max(revenues.concat(netProfits));
  
    const yScale = d3
      .scaleLinear()
      .domain([0, maxRevenue!])
      .range([height, 0]);
  
    svg
      .append('g')
      .attr('transform', `translate(0, ${yScale(0)})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .style('font-size', 12)
      .text('Year');
  
    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('dy', '1em')
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .style('font-size', 12)
      .attr('text-anchor', 'middle')
      .text('Revenues and Net Profits Over Time');
  
    const lineRevenues = d3
      .line<any>()
      .x((d) => xScale(String(d.year))! + xScale.bandwidth() / 2)
      .y((d) => yScale(d.revenue));
  
    const lineNetProfits = d3
      .line<any>()
      .x((d) => xScale(String(d.year))! + xScale.bandwidth() / 2)
      .y((d) => yScale(d.netProfit));
  
    svg
      .append('path')
      .datum(data)
      .attr('class', 'line-revenue')
      .attr('d', lineRevenues)
      .attr('fill', 'none')
      .attr('stroke', this.colorPalette[2]);
  
    svg
      .append('path')
      .datum(data)
      .attr('class', 'line-net-profit')
      .attr('d', lineNetProfits)
      .attr('fill', 'none')
      .attr('stroke', 'red');
  
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Segoe UI')
      .style('font-size', 16)
      .style('font-weight', 'bold')
      .text('Revenues and Net Profits Over Time');
  }
  

  private createLegend(
    svg: d3.Selection<any, unknown, null, undefined>,
    legendLabels: string[],
    legendColors: string[]
  ): void {

    const legend = svg
      .append('g')
      .attr('transform', 'translate(' + 90 + ',' + (180 + 60 +20 ) + ')'); // Hier wurde die y-Koordinate angepasst
  
    const legendRectSize = 13;
    const legendSpacing = 2;
  
    const legendItems = legend
      .selectAll('.legende-item')
      .data(legendLabels)
      .enter()
      .append('g')
      .attr('class', 'legende-item')
      .attr('transform', (d, i) => 'translate(0,' + i * (legendRectSize + legendSpacing) + ')');
  
    legendItems
      .append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', (d, i) => legendColors[i]);
  
    legendItems
      .append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text((d) => d)
      .style('font-family', 'Segoe UI')
      .style('font-size', '13px'); 
  }
}  