import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataServiceEmissions, DataServiceColors } from '../cart.service'; //service for injecting data


@Component({
  selector: 'app-plot-roi',
  standalone: true,
  imports: [],
  templateUrl: './plot-roi.component.html',
  styleUrl: './plot-roi.component.css',
})

export class PlotROIComponent implements OnInit {
  colorPalette: string[] = []; 


  constructor(
    private dataService: DataServiceEmissions,
    private dataColors: DataServiceColors
  ) {}

  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  ngOnInit(): void {

    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    this.dataColors.getData().subscribe((colorPalette) => {
      
      this.colorPalette = colorPalette;
      this.plotChart(); 
    });
  }
  private plotChart(): void {
    
    const years = [2020, 2021, 2022, 2023, 2024];
    const revenues = [10000, 12000, 15000, 18000, 20000];
    const costs = [8000, 9000, 10000, 12000, 13000];
    const investments = [5000, 0, 0, 0, 0]; 

    const data = years.map((year, index) => ({
      year,
      revenue: revenues[index],
      cost: costs[index],
      investment: investments[index],
      netProfit: revenues[index] - costs[index] - investments[index],
    }));

       const margin = { top: 60, right: 90, bottom: 60, left: 80 };
       const width = 400 - margin.left - margin.right;
       const height = 320 - margin.top - margin.bottom;
   
       const svg = d3 
         .select(this.chartContainer.nativeElement)
         .append('svg')
         .attr('width', width + margin.left + margin.right)
         .attr('height', height + margin.top + margin.bottom + 20)
         .append('g')
         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
         this.createLegend(svg, ['Revenue', 'Cost', 'Net Profit'], [this.colorPalette[2], this.colorPalette[4], 'red']);

       const xScale = d3
         .scaleBand()
         .domain(years.map(String))
         .range([0, width])
         .padding(0.1);
    
        const maxRevenue = d3.max(revenues)
        const smallestNetProfit = data.reduce((min, d) => {
          return Math.min(min, d.netProfit);
        }, Infinity);

       const yScale = d3
       .scaleLinear()
       .domain([smallestNetProfit, maxRevenue!])
       .range([height, 0]);
    
       svg
         .append('g')
         .attr('transform', `translate(0, ${height})`)
         .call(d3.axisBottom(xScale))
         .append('text')
         .attr('x', width /2 )
         .attr('y', 30 ) 
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
         .text('Costs and Revenues');
  
        
         data.forEach((d) => {
          if (d.cost > d.revenue) {
            // Füge das Rechteck für Kosten zuerst hinzu
            svg
              .append('rect')
              .attr('class', 'cost')
              .attr('x', xScale(String(d.year))!)
              .attr('y', yScale(d.cost))
              .attr('width', xScale.bandwidth())
              .attr('height', height - yScale(d.cost))
              .attr('fill', this.colorPalette[4]);
            
            // Füge das Rechteck für Einnahmen hinzu
            svg
              .append('rect')
              .attr('class', 'revenue')
              .attr('x', xScale(String(d.year))!)
              .attr('y', yScale(d.revenue))
              .attr('width', xScale.bandwidth())
              .attr('height', height - yScale(d.revenue))
              .attr('fill', this.colorPalette[2]);
          } else {
            // Füge das Rechteck für Einnahmen zuerst hinzu
            svg
              .append('rect')
              .attr('class', 'revenue')
              .attr('x', xScale(String(d.year))!)
              .attr('y', yScale(d.revenue))
              .attr('width', xScale.bandwidth())
              .attr('height', height - yScale(d.revenue))
              .attr('fill', this.colorPalette[2]);
        
            // Füge das Rechteck für Kosten hinzu
            svg
              .append('rect')
              .attr('class', 'cost')
              .attr('x', xScale(String(d.year))!)
              .attr('y', yScale(d.cost))
              .attr('width', xScale.bandwidth())
              .attr('height', height - yScale(d.cost))
              .attr('fill', this.colorPalette[4]);
          }
        });
        
    const line = d3
      .line<any>()
      .x((d) => xScale(String(d.year))! + xScale.bandwidth() / 2)
      .y((d) => yScale(d.netProfit));
  
    svg
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'red');    
  }

  private createLegend(
    svg: d3.Selection<any, unknown, null, undefined>,
    legendLabels: string[],
    legendColors: string[]
  ): void {

    const legend = svg
      .append('g')
      .attr('transform', 'translate(' + (250) + ',10)'); 
  
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