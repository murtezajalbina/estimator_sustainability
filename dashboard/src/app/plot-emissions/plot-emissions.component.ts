import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import _ from 'lodash';
import { DataServiceEmissions, DataServiceColors } from '../cart.service'; //service for injecting data

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

  constructor(
    private dataService: DataServiceEmissions,
    private dataColors: DataServiceColors
  ) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe((data) => {
      //read emissions data
      this['data'] = data;
    });
    this.dataColors.getData().subscribe((color) => {
      //read color data
      this['colorPalette'] = color;
    });
    this.createBarChart();
  }

  private createBarChart(): void {
    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    //Type of Emissions Data
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

    const data: DataProp[] = this['data'];

    const selectedProduct = data[0]; // todo change this in future for product selection

    const calcualteEmission = (component: DataPoint, volume: number) => {
      return component.emission * component.quantity * volume;
    };

    const calculateMaxEmissionPerYear = (sale: YearSales): number => {
      const volume = sale.volume;
      const resultArray: number = sale.components.reduce(
        (acc, s) => acc + s.emission * s.quantity * volume,
        0
      );
      return resultArray;
    };

    // Calculate all emissions for height of the plot
    const calculateMaxEmission = (): number => {
      const emissionArray: number[] = selectedProduct.sales.map((s) =>
        calculateMaxEmissionPerYear(s)
      );
      return Math.max(...emissionArray);
    };

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
      .range(this['colorPalette'].slice(0, materials.length));

    // add x axis
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // add y axis
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

    // Step 2: Transform the aggregated data for d3.stack()
    const transformedData = Object.entries(aggregatedData).map(
      ([year, materials]) => ({
        year: +year, // Convert back to number
        ...materials,
      })
    );

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
      .style('font-family', 'Segoe UI')
      .style('font-size', 12)
      .text('Year');

    // Y label
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(-30,' + height / 2.5 + ')rotate(-90)')
      .attr('y', -10)
      .style('font-family', 'Segoe UI')
      .style('margin-right', '90')
      .style('font-size', 12)
      .text('Emissions');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -20) // Adjust the vertical position of the title
      .attr('text-anchor', 'middle')
      .style('font-family', 'Segoe UI')
      .style('font-size', 16) // You can adjust the font size as needed
      .style('font-weight', 'bold')
      .text('Emissions Over Time'); // Replace with your desired title

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
        return isFinite(y0 - y1) ? y0 - y1 : 0;
      })
      .attr('width', x.bandwidth())

      .on('mouseover',  (event, d) => {
        // make all bars transparent
        svg.selectAll('rect').style('opacity', 0.2);
        
        const hoveredData = d3.select((<any>this).parentNode)
        console.log('hey', hoveredData)

        // make the chosen bar visible
      /*   d3.select(this).style('opacity', 1); */
        console.log('hello', this['data'])
       
      })
      .on('mouseout', function (event, d) {
        // make all bars visible again
        svg.selectAll('rect').style('opacity', 1);
      
        // make all legend items visible again
        svg.selectAll('.legend-item').style('opacity', 1);
      });
      
      
    this.createLegend(svg, materials, colorScale);

    //desciption below the plot
    svg
      .append('text')
      .attr('x', -30)
      .attr('y', height + margin.bottom - 10) // Anpassung der Position relativ zum unteren Rand
      .attr('text-anchor', 'start')
      .attr('lengthAdjust', 'spacing')
      .style('font-family', 'Segoe UI')
      .style('font-size', 12)
      .text(
        'The emissions of your product are distributed among its materials. The materials include aluminum, steel, and other components.'
      );
  }

  //legend for materials
  private createLegend(
    svg: d3.Selection<any, unknown, null, undefined>,
    materials: string[],
    colorScale: d3.ScaleOrdinal<string, string>
  ): void {
    const legend = svg
      .append('g')
      .attr('transform', 'translate(' + 230 + ',5)')
      .attr('width', 300);

    const legendRectSize = 13;
    const legendSpacing = 2;

    const legendItems = legend
      .selectAll('.legend-item')
      .data(materials)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr(
        'transform',
        (d, i) => 'translate(0,' + i * (legendRectSize + legendSpacing) + ')'
      );

    legendItems
      .append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', (d) => colorScale(d));

    legendItems
      .append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text((d) => d)
      .style('font-family', 'Segoe UI');
  }
}
