import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataServiceColors, DataServiceCosts, DataServiceEmissions } from '../cart.service';
import { HttpClient } from '@angular/common/http';
import { forEach } from 'lodash';
@Component({
  selector: 'app-plot-costs',
  standalone: true,
  templateUrl: './plot-costs.component.html',
  styleUrl: './plot-costs.component.css'
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
      //read emissions data
      this['data'] = data;
    });
    this.dataColors.getData().subscribe((color) => {
      //read color data
      this['colorPalette'] = color;
    });
    this.dataCost.getData().subscribe((cost) => {
      this['costs'] = cost;
    })
    this.createLinePlot();
  }
  
  private calculateEmmisionCost(cost_per_messure: any) {
    let totalExtraCostResult=0;
    cost_per_messure.forEach((item: { costs: number; }) => {
      totalExtraCostResult += item.costs;
    });
   return totalExtraCostResult;
  }

  private calculateAllMaterialCost (data: any ,cost: any) {   
    let resultArray: { productName: any; salesYear: null; totalMaterialCost: number; }[] = [];

    console.log(data[0])
    data.forEach((product: any) => {
      product.sales.forEach((sales: any) => {
        let productInfo = {
          productName: product.product,
          salesYear: sales.year, // Initialize salesYear here
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

  createChart(data:any){

    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    const margin = { top: 60, right: 90, bottom: 50, left: 80 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    //create the SVG element and append it to the body
    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


      //Create the x scale using the salesYear values
      const x = d3
      .scaleBand()
      .domain(data.map((s:any) => s.salesYear ))
      .range([0, width])
      .padding(0.1);

      //Create the y scale using the totalMaterialCost values
      const y = d3
      .scaleLinear()
      .domain([5000, 40000])
      .range([height, 0]);

      //create the x axis and append it to the svg
      //const xAxis = d3.axisBottom(x).tickFormat(d3.format());
      svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // create y axis
    svg.append('g').call(d3.axisLeft(y));


    const dataPoints = data.map((d:any) => ({ x: d.salesYear, y: d.totalMaterialCost }));
    console.log(dataPoints);

    svg.append('g')
    .selectAll("dot")
    .data(dataPoints)
    .enter()
    .append("circle")
    .attr("r", 2)
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .style("fill", "#CC0000");

    /* const line = d3.line()
    .x(d => (x ? x(d.x.toString()) + x.bandwidth() / 2 : 0))
    .y(d => )
    .curve(d3.curveCardinal); */
    dataPoints.forEach((d: { salesYear: number; totalMaterialCost: number; }) => {
      d.salesYear = +d.salesYear; // Convert to number using the unary plus operator
      d.totalMaterialCost = +d.totalMaterialCost; // Convert to number
    });
    
    const xScale = d3.scaleLinear().domain(data.map((s:any) => s.salesYear )).range([0, width]);
    const yScale = d3.scaleLinear().domain([5000, 40000]).range([height, 0]);
    
   // Create line generator
const line = d3.line()
/* .x(d => xScale(d.salesYear))
.y(d => yScale(d.totalMaterialCost)) */
.curve(d3.curveBasis); // Use basis curve
        

        svg.append("path")
        .datum(dataPoints) 
        .attr("class", "line") 
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", "none")
        .style("stroke", "blue")
        .style("stroke-width", "2")
        .attr("d", line);


  /*   svg.append('path')
    .datum(dataPoints)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', line); */


    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 15)
   /*    .attr('transform', 'y-translate(-30)') */
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
      .attr('y', -20) // Adjust the vertical position of the title
      .attr('text-anchor', 'middle')
      .style('font-family', 'Segoe UI')
      .style('font-size', 16) // You can adjust the font size as needed
      .style('font-weight', 'bold')
      .text('Total cost of '+ data[0].productName)
    
  }

  private createLinePlot(){
    const data = this['data'];
    const cost = this['costs'];

    const totalMaterialCost = this.calculateAllMaterialCost(data,cost[0].Kosten_pro_Material)
    console.log(totalMaterialCost)

    console.log(data.filter((product: { productName: string; }) => product ))

    const selectedData = totalMaterialCost.filter(item => item.productName === 'Drive 1');
    console.log(selectedData[0].salesYear)
    this.createChart(selectedData);


    const emmsionCost = this.calculateEmmisionCost(cost[1].Kosten_pro_Maßnahme);
    console.log(emmsionCost)

    /* add totalmaterial cost to extra cost and make a totalcost method which will have all he information */
   
  }

}


