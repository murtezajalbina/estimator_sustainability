import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import {
  DataServiceColors,
  DataServiceCosts,
  DataServiceEmissions,
  SelectedItemService,
} from '../cart.service';

import { SelectedValuesService, TableUpdateService } from '../measures.service';
import { combineLatest } from 'rxjs';
import { MaterialRelatedMeasure } from '../material-related-measure';

@Component({
  selector: 'app-plot-costs',
  standalone: true,
  templateUrl: './plot-costs.component.html',
  styleUrls: ['../app.component.css'],
})
export class PlotCostsComponent implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  selectedItem: string = 'default';

  constructor(
    private selectedItemService: SelectedItemService,
    private tableUpdateService: TableUpdateService
  ) {}

  ngOnInit(): void {
    let table: MaterialRelatedMeasure[] = [];

    this.selectedItemService.selectedItem$.subscribe((selectedItem) => {
      this.selectedItem = selectedItem;
      this.createChart(selectedItem, table);
    });

    this.tableUpdateService.rowAdded.subscribe(
      (tableData: MaterialRelatedMeasure[]) => {
        table = tableData;
        this.createChart(this.selectedItem, table);
      }
    );
  }

  private createChart(
    selectedItem: string,
    table: MaterialRelatedMeasure[]
  ): void {
    let years: number[];
    let dummycosts: number[];
    let dummyinvestment: number[];
    let newcosts: any = [];

    if (selectedItem == 'Drive 1') {
      years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
      dummycosts = [16000, 13500, 9900, 12500, 12400, 12200, 13200, 12000];
      dummyinvestment = [15200, 13500, 9900, 12500, 12400, 12200, 13200, 12000];
    } else {
      years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
      dummycosts = [16000, 14000, 11000, 14000, 12400, 12200, 13200, 12000];
      dummyinvestment = [
        16000, 14000, 11000, 14000, 12400, 12200, 13200, 12000,
      ];
    }

    newcosts = [16000, 13500, 9900, 12500, 12400, 12200, 13200, 12000];
    for (let i = 0; i <= table.length - 1; i++) {
      const lastRow = table[i];
      const year = lastRow.year;
      const percent = lastRow.percent;
      let x = years.findIndex((y) => y === year);
      newcosts = newcosts.map((value: number, index: number) => {
        if (index === x) {
          return value + (value * percent) / 100;
        } else if (index > x) {
          return value - value / 3;
        } else {
          return value;
        }
      });
    }

    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    const costdata: [number, number][] = years.map((year, index) => [
      year,
      dummycosts[index],
    ]);

    const newcostsdata: [number, number][] = years.map((year, index) => [
      year,
      newcosts[index],
    ]);

    const maxcosts =
      Math.max(Math.max(...dummycosts), Math.max(...newcosts)) + 4000;

    const margin = { top: 60, right: 50, bottom: 80, left: 90 };
    const width = 450 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([2023, 2030]).range([0, width]);

    const x = d3.scaleLinear().domain([2023, 2030]).range([0, width]);

    const yScale = d3.scaleLinear().domain([0, maxcosts]).range([height, 0]);

    const lineGenerator = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => yScale(d[1]));

    const area = d3
      .area<number>()
      .x((_, i: number) => xScale(years[i]) || 0)
      .y0((_, i: number) => yScale(dummycosts[i]) || 0)
      .y1((d: any, i: number) => yScale(newcosts[i]) || 0);


    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + 200)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const xAxis = d3
      .axisBottom(x)
      .tickValues(years) 
      .tickFormat(d3.format('d'));

    svg
      .append('g')
      .attr('transform', `translate(0, ${yScale(0)})`)
      .call(xAxis)
      .append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .style('font-size', 12)
      .text('Year');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Segoe UI')
      .style('font-size', 16)
      .style('font-weight', 'bold')
      .text('Cost Development Over Time');

    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 30)
      .attr('x', -height / 2)
      .attr('dy', '1em')
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .style('font-size', 12)
      .attr('text-anchor', 'middle')
      .text('Costs');

    svg
      .append('path')
      .datum(newcostsdata)
      .attr('fill', 'none')
      .attr('stroke', 'maroon')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    svg
      .append('path')
      .datum(costdata)
      .attr('fill', 'none')
      .attr('stroke', '#0095FF')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    // Fläche zwischen den Linien füllen
    svg
      .append('path')
      .datum(newcosts)
      .attr('class', 'area')
      .attr('d', area)
      .attr('stroke-width', 2)
      .style('fill', '#F6CECE');

    const legendItems = ['Costs', 'Costs with applied measures'];
    const legendColors = ['#0095FF', 'maroon'];

    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(0, ${-40})`);

    const legendItemWidth = 120;
    const legendItemHeight = 17;
    const legendPadding = 10;

    const legendGroup = legend
      .selectAll('.legend-item')
      .data(legendItems)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr(
        'transform',
        (_d: any, i: number) =>
          `translate(${i * (legendItemWidth + 2 * legendPadding)}, 290)` // Legen Sie den horizontalen Abstand fest
      );

    legendGroup
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', legendItemHeight)
      .attr('height', legendItemHeight)
      .style('fill', (_d, i) => legendColors[i]);

    legendGroup
      .append('text')
      .attr('x', legendItemHeight + legendPadding)
      .attr('y', legendItemHeight / 2)
      .attr('dy', '0.35em')
      .text((d) => d)
      .style('fill', '#000')
      .style('font-size', '12px')
      .style('font-family', 'Arial');
  }
}
