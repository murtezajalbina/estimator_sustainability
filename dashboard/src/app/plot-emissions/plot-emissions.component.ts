// d3-chart.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import _ from 'lodash'


@Component({
  selector: 'app-plot-emissions',
  standalone: true,
  imports: [],
  templateUrl: './plot-emissions.component.html',
  styleUrl: './plot-emissions.component.css'
})



export class PlotEmissionsComponent implements OnInit{


  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
          
  ngOnInit(): void {
    this.createBarChart();
  }

  public cap = require("./CAP.json");
  public colorPalette = this.cap.dataColors;


  private createBarChart(): void {

    d3.select(this.chartContainer.nativeElement).select('svg').remove();
    
    type DataProp = {
      product : string;
      sales: YearSales[]
    }

    type DataPoint = {
      material : string;
      quantity : number;
      emission : number
    }

    type YearSales = {
      year: number;
      volume : number
      components : DataPoint[]
    }

    const data : DataProp[] = require("./dummy-data-emissions.json")


    const selectedProduct = data[0]; // todo change this in future for product selection

    const yearArray = selectedProduct.sales.map( s => s.year.toString());
    const calculateMaxEmission = () : number => {
      const emissionArray : number[] = selectedProduct.sales.map( s => calculateMaxEmissionPerYear(s));
      return Math.max(...emissionArray);
    }

    const calcualteEmission = (component : DataPoint , volume : number) => {
      return component.emission*component.quantity*volume;
    }

 /*  // das gleiche wie oben 
    function myCalculateEmission(component : DataPoint , volume : number){
      return component.emission*component.quantity*volume;
    } */

    const calculateMaxEmissionPerYear = (sale : YearSales) : number => {
      const volume = sale.volume;
      const resultArray : number = sale.components.reduce( (acc , s ) => acc + s.emission * s.quantity * volume, 0);
      return resultArray
    }


    
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  

    const svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3.scaleBand()
      .domain(selectedProduct.sales.map( s => s.year.toString()))
      .range([0, width])
      .padding(0.1)
      
  
    console.log(data[0])
    
    const y = d3.scaleLinear()
      .domain([0, calculateMaxEmission()]) 
      .range([0, height]);


  const materials = selectedProduct.sales[0].components.map( m => m.material);
  const colorScale: d3.ScaleOrdinal<string, string> = d3.scaleOrdinal<string>()
  .domain(materials)
  .range(this.colorPalette.slice(0, materials.length));

  
    // X-Achse hinzufügen
  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));
      
  
    // Y-Achse hinzufügen
  svg.append('g')
      .call(d3.axisLeft(y));

    type SeriesProp = {
      year : number;
      material : string;
      emission:number;
    }

    const myData :SeriesProp[] = [];

    selectedProduct.sales.forEach(( sale ) =>  sale.components.forEach( (comp ) => myData.push({year: sale.year, material: comp.material , emission: calcualteEmission( comp, sale.volume)})))
    
    const groupedData = _.groupBy(myData, 'year')
    console.log("grouped", groupedData);
    const emissionArray = selectedProduct.sales[0].components.map( c => { key: c.material ; c.emission*c.quantity * selectedProduct.sales[0].volume})

    const series = d3.stack()   
    .keys(d3.union(myData.map(d => d.material))) // aluminium, steel, other 
    .value((d, key) => d[key])  // get value for each series key and stack
    (d3.index(myData, d => d.emission, d => d.material))

    // X label
    svg.append('text')
        .attr('x', width/2)
        .attr('y', height + 30)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Year');
            
    // Y label
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(-30,' + height/2 + ')rotate(-90)')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Emissions');


    
    console.log("series: ", series)
    
    console.log("union",d3.union(myData.map(d => d.material)));
    // Balken hinzufügen
    svg.selectAll()
      .data( selectedProduct.sales)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.year.toString()) || 0) // Handle undefined case
      //.attr('y', d => y())
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.components[0].emission*d.components[0].quantity * d.volume))
      .attr("fill", function(d){return colorScale(d.year.toString()) });
  }
 }
