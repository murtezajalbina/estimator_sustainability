import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import _ from 'lodash';

@Component({
  selector: 'app-plot-emissions',
  standalone: true,
  imports: [],
  templateUrl: './plot-emissions.component.html',
  styleUrl: './plot-emissions.component.css',
})
export class PlotEmissionsComponent implements OnInit {
  [x: string]: any;
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  ngOnInit(): void {
    this.createBarChart();
  }

  public cap = require('../data/CAP.json');
  public colorPalette = this.cap.dataColors;

  private createBarChart(): void {
    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    type DataProp = {
      product: string;
      sales: YearSales[];
    };

    type DataPoint = {
      material: string;
      quantity: number;
      emission: number;
    };

    type YearSales = {
      year: number;
      volume: number;
      components: DataPoint[];
    };

    const data: DataProp[] = require('../data/dummy-data-emissions.json');

    const selectedProduct = data[0]; // todo change this in future for product selection

    const yearArray = selectedProduct.sales.map((s) => s.year.toString());
    const calculateMaxEmission = (): number => {
      const emissionArray: number[] = selectedProduct.sales.map((s) =>
        calculateMaxEmissionPerYear(s)
      );
      return Math.max(...emissionArray);
    };

    const calcualteEmission = (component: DataPoint, volume: number) => {
      return component.emission * component.quantity * volume;
    };

    /*  // das gleiche wie oben 
    function myCalculateEmission(component : DataPoint , volume : number){
      return component.emission*component.quantity*volume;
    } */

    const calculateMaxEmissionPerYear = (sale: YearSales): number => {
      const volume = sale.volume;
      const resultArray: number = sale.components.reduce(
        (acc, s) => acc + s.emission * s.quantity * volume,
        0
      );
      return resultArray;
    };

    const margin = { top: 20, right: 90, bottom: 30, left: 80 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3
      .scaleBand()
      .domain(selectedProduct.sales.map((s) => s.year.toString()))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, calculateMaxEmission()])
      .range([height, 0]);

    const materials = selectedProduct.sales[0].components.map(
      (m) => m.material
    );

    const colorScale: d3.ScaleOrdinal<string, string> = d3
      .scaleOrdinal<string>()
      .domain(materials)
      .range(this.colorPalette.slice(0, materials.length));

    // X-Achse hinzufügen
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // Y-Achse hinzufügen
    svg.append('g').call(d3.axisLeft(y));

    type SeriesProp = {
      year: number;
      material: string;
      emission: number;
    };

    const myData: SeriesProp[] = [];

    selectedProduct.sales.forEach((sale) =>
      sale.components.forEach((comp) =>
        myData.push({
          year: sale.year,
          material: comp.material,
          emission: calcualteEmission(comp, sale.volume),
        })
      )
    );

    // The aggregated data's type is a record where the key is a string (year) and the value is another record
    // The inner record's key is the material string, and its value is the emission number
    type AggregatedDataType = Record<string, Record<string, number>>;

    // Step 1: Aggregate emissions by year and material
    const aggregatedData: AggregatedDataType = myData.reduce(
      (acc: AggregatedDataType, { year, material, emission }) => {
        const yearKey = year.toString(); // Convert year to string to use as a key
        if (!acc[yearKey]) {
          acc[yearKey] = {};
        }
        if (!acc[yearKey][material]) {
          acc[yearKey][material] = 0;
        }
        acc[yearKey][material] += emission;
        return acc;
      },
      {}
    );

    /*  console.log("aggregatedData",aggregatedData); */

    /*   const groupedData = _.groupBy(myData, 'year');
    console.log('grouped', groupedData);
    const emissionArray = selectedProduct.sales[0].components.map((c) => {
      key: c.material;
      c.emission * c.quantity * selectedProduct.sales[0].volume;
    });
 */
    // Step 2: Transform the aggregated data for d3.stack()
    console.log('entries', Object.entries(aggregatedData));
    const transformedData = Object.entries(aggregatedData).map(
      ([year, materials]) => ({
        year: +year, // Convert back to number
        ...materials,
      })
    );

    // Assuming d3 is imported and set up correctly
    const series = d3
      .stack()
      .keys(d3.union(myData.map((d) => d.material))) // Extract unique materials
      .value((d: any, key: string) => d[key] || 0)(
      // Use a fallback value of 0 for missing emissions
      transformedData as any
    ); // Cast to 'any' if necessary to match d3's expected input type

    // X label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 15)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Helvetica')
      .style('font-size', 12)
      .text('Year');

    // Y label
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(-30,' + height / 2.5 + ')rotate(-90)')
      .attr('y', -10)
      .style('font-family', 'Helvetica')
      .style('margin-right', '90')
      .style('font-size', 12)
      .text('Emissions');

    svg
      .append('g')
      .selectAll('g')
      .data(series)
      .join('g')
      .attr('fill', (d) => colorScale(d.key))
      .selectAll('rect')
      .data((D) => D)
      .join('rect')
      .attr('x', (d) => x(d.data['year'].toString())!)
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => {
        const y0 = y(d[0]);
        const y1 = y(d[1]);
        return isFinite(y0 - y1) ? y0 - y1 : 0; // Provide 0 or another fallback value as needed
      })
      .attr('width', x.bandwidth());


    
    // Balken hinzufügen
    /*  svg
      .selectAll()
      .data(selectedProduct.sales)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.year.toString()) || 0) // Handle undefined case
      .attr('y', d => y(d.components[0].emission))
      .attr('width', x.bandwidth())
      .attr(
        'height',
        (d) =>
          height -
          y(d.components[0].emission * d.components[0].quantity * d.volume)
      )
      .attr('fill', function (d) {
        return colorScale(d.year.toString());
      }); */
  }
}
