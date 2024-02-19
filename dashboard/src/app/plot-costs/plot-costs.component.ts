import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataServiceColors, DataServiceCosts, DataServiceEmissions } from '../cart.service';
import { HttpClient } from '@angular/common/http';
import { forEach } from 'lodash';

@Component({
  selector: 'app-plot-costs',
  standalone: true,
  templateUrl: './plot-costs.component.html',
  styleUrls: ['./plot-costs.component.css']
})

export class PlotCostsComponent implements OnInit {

  [x: string]: any;

  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private svg: any;
  private xScale: any;
  private yScale: any;

  constructor(
    private dataService: DataServiceEmissions,
    private dataColors: DataServiceColors,
    private dataCost: DataServiceCosts
  ) { }

  ngOnInit(): void {
    this.dataService.getData().subscribe((data) => {
      this['data'] = data;
    });

    this.dataColors.getData().subscribe((color) => {
      this['colorPalette'] = color;
    });

    this.dataCost.getData().subscribe((cost) => {
      this['costs'] = cost;
    });

    this.createLinePlot();
  }

  private calculateEmmisionCost(cost_per_messure: any) {
    let totalExtraCostResult = 0;
    cost_per_messure.forEach((item: { costs: number; }) => {
      totalExtraCostResult += item.costs;
    });
    return totalExtraCostResult;
  }

  private calculateAllMaterialCost(data: any, cost: any) {
    let resultArray: { productName: any; salesYear: null; totalMaterialCost: number; }[] = [];

    data.forEach((product: any) => {
      product.sales.forEach((sales: any) => {
        let productInfo = {
          productName: product.product,
          salesYear: sales.year,
          totalMaterialCost: 0
        };

        sales.components.forEach((components: any) => {
          let materialCost;

          if (components.material === "aluminium") {
            materialCost = components.quantity * sales.volume * cost.Aluminium;
          } else if (components.material === "steel") {
            materialCost = components.quantity * sales.volume * cost.Steel;
          } else {
            materialCost = components.quantity * sales.volume * cost.Other;
          }

          productInfo.totalMaterialCost += materialCost;
        });

        resultArray.push(productInfo);
      });
    });
    return resultArray;
  }

  createChart(data: any) {

    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    const margin = { top: 60, right: 90, bottom: 50, left: 80 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3
      .scaleBand()
      .domain(data.map((s: any) => s.salesYear))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([5000, 40000])
      .range([height, 0]);

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));

    const dataPoints = data.map((d: any) => ({ x: d.salesYear, y: d.totalMaterialCost }));

    svg.append('g')
      .selectAll("dot")
      .data(dataPoints)
      .enter()
      .append("circle")
      .attr("r", 2)
      .attr("cx", (d: any) => x(d.x) || 0)  // Use x scale to position
      .attr("cy", (d: any) => y(d.y) || 0)  // Use y scale to position
      .style("fill", "#CC0000");

    dataPoints.forEach((d: { x: number; y: number; }) => {
      d.x = +d.x;
      d.y = +d.y;
    });

    const xScale = d3.scaleLinear().domain(data.map((s: any) => s.salesYear)).range([0, width]);
    const yScale = d3.scaleLinear().domain([5000, 40000]).range([height, 0]);

    const line = d3.line()
      .x((d: any) => xScale(d.x) || 0)  // Use x scale to position
      .y((d: any) => yScale(d.y) || 0)  // Use y scale to position
      .curve(d3.curveBasis);

    svg.append("path")
      .datum(dataPoints)
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke", "blue")
      .style("stroke-width", "2")
      .attr("d", line);

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', 12)
      .text('Year');

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(-30,' + height / 2.5 + ')rotate(-90)')
      .attr('y', -15)
      .style('margin-right', '90')
      .style('font-size', 12)
      .text('Cost');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Segoe UI')
      .style('font-size', 16)
      .style('font-weight', 'bold')
      .text('Total cost of ' + data[0].productName);
  }

  private createLinePlot() {
    const data = this['data'];
    const cost = this['costs'];

    const totalMaterialCost = this.calculateAllMaterialCost(data, cost[0].Kosten_pro_Material);
    const selectedData = totalMaterialCost.filter(item => item.productName === 'Drive 1');
    this.createChart(selectedData);
  }
}

