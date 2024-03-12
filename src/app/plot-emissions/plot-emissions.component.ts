import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataServiceEmissions, DataServiceColors } from '../cart.service'; // Service for injecting data
import { DataProp } from '../dataProp';
import { SelectedItemService } from '../measuresService';

@Component({
  selector: 'app-plot-emissions',
  standalone: true,
  imports: [],
  templateUrl: './plot-emissions.component.html',
  styleUrls: ['../app.component.css']
})
export class PlotEmissionsComponent implements OnInit {
  [x: string]: any;

  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  constructor(
    private dataService: DataServiceEmissions,
    private dataColors: DataServiceColors,
    private selectedItemService: SelectedItemService // Fügen Sie den Service hinzu

  ) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe((data) => {
      this['data'] = data;
    });
    this.dataColors.getData().subscribe((color) => {
      this['colorPalette'] = color;
    });
/*     this.selectedItemService.selectedItem$.subscribe((selectedItem) => {
      if (selectedItem) {
        const filteredData = this['data'].filter(
          (product: { product: string; }) => product.product === selectedItem
        );
        this.updateEmissionsPlot(filteredData[0]);
      }
    }); */
    
    this.createBarChart();
  }

  private updateEmissionsPlot(selectedProduct: DataProp): void {
    // Fügen Sie hier die Logik hinzu, um das Emissionsplot mit den aktualisierten Daten zu erstellen
    // Verwenden Sie die ausgewählten Produktinformationen (selectedProduct)
  }

  calculateMaxEmissionPerYear() {}

  private createBarChart(): void {
    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    const data: DataProp[] = this['data'];

    const selectedProduct = data[0]; // Todo: change this in the future for product selection

    const calculateEmission = (component: any, volume: number) => {
      return component.emission * component.quantity * volume;
    };

    const calculateMaxEmissionPerYear = (sale: any): number => {
      const volume = sale.volume;
      const resultArray: number = sale.components.reduce(
        (acc: number, s: { emission: number; quantity: number }) =>
          acc + s.emission * s.quantity * volume,
        0
      );
      return resultArray;
    };

    // Calculate all emissions for the height of the plot
    const calculateMaxEmission = (): number => {
      const emissionArray: number[] = selectedProduct.sales.map((s) =>
        calculateMaxEmissionPerYear(s)
      );
      return Math.max(...emissionArray);
    };

    const margin = { top: 60, right: 90, bottom: 60, left: 80 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + 200)
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

    // Add x axis
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // Add y axis
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
          emission: calculateEmission(comp, sale.volume),
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
      .attr('y', height + 30)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Segoe UI')
      .style('font-size', 12)
      .style('font-weight', 'bold')
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
      .style('font-weight', 'bold')
      .text('Emissions');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Segoe UI')
      .style('font-size', 16)
      .style('font-weight', 'bold')
      .text('Emissions Over Time');

    this.createLegend(svg, materials, colorScale);

    svg.append('g').selectAll('g').data(series).join('g');
    svg
      .append('g')
      .selectAll('g')
      .data(series)
      .join('g')
      .attr('fill', (d1) => {
        const material = d1.key;
        return colorScale(material);
      })

      .selectAll('rect')
      .data((D) => D)
      .join('rect')
      .attr('material', (d) => d.data['material'])
      .attr('class', 'my-rect') // Add the class 'my-rect'

      .attr('x', (d) => x(d.data['year'].toString())!)
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => {
        const y0 = y(d[0]);
        const y1 = y(d[1]);
        return isFinite(y0 - y1) ? y0 - y1 : 0;
      })
      .attr('width', x.bandwidth())
      .on('mouseover', function (event, d) {
        svg.selectAll('.my-rect').style('opacity', 0.2);
        const material = (d3.select(this) as any).node().parentNode.__data__
          .key;

        d3.selectAll('.my-rect').each(function (rectData) {
          var isSameMaterial =
            (d3.select(this) as any).node().parentNode.__data__.key ===
            material;

          if (isSameMaterial) {
            d3.select(this).style('opacity', 1);
          }
        });

        d3.selectAll('.legend-item').style('opacity', (legendMaterial) =>
          legendMaterial === material ? 1 : 0.22
        );

        svg
          .selectAll('.legend-item rect')
          .style('opacity', (legendMaterial) =>
            legendMaterial === material ? 1 : 0.2
          );
      })
      .on('mouseout', function (event, d) {
        // Make all bars visible again
        svg.selectAll('rect').style('opacity', 1);
        // Make all legend items visible again
        d3.selectAll('.legend-item').style('opacity', 1);
      });

    // Description below the plot
  }

  private createLegend(
    svg: d3.Selection<any, unknown, null, undefined>,
    materials: string[],
    colorScale: d3.ScaleOrdinal<string, string>
  ): void {
    const margin = { top: 60, right: 90, bottom: 60, left: 80 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
  
    const legend = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top + 10) + ')'); // Hier wurde die y-Koordinate angepasst
  
    const legendRectSize = 13;
    const legendSpacing = 2;
  
    const legendItems = legend
      .selectAll('.legend-item')
      .data(materials)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('material', (d) => d)
      .attr(
        'transform',
        (d, i) => 'translate(0,' + i * (legendRectSize + legendSpacing) + ')'
      );
  
    legendItems
      .append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .attr('material', (d) => d)
      .style('fill', (d) => colorScale(d));
  
    legendItems
      .append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text((d) => d)
      .style('font-family', 'Segoe UI')
      .style('font-size', '13px');
  }
}
