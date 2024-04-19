import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import {
  DataServiceEmissions,
  DataServiceColors,
  SelectedItemService,
} from '../cart.service';
import { DataProp } from '../dataProp';
import { TableUpdateService } from '../measures.service';
import { DataServiceReduction } from '../cart.service';
import { MaterialRelatedMeasure } from '../material-related-measure';
import { TransformationService } from '../transformation.service';

@Component({
  selector: 'app-plot-emissions',
  standalone: true,
  imports: [],
  templateUrl: './plot-emissions.component.html',
  styleUrls: ['../app.component.css'],
})
export class PlotEmissionsComponent implements OnInit {
  [x: string]: any;
  selectedItem: string = 'default';
  emissionAluminium: any = [];
  emissionSteel: any = [];
  emissionOther: any = [];
  years: number[] = [];
  emissionsAluminium: number[] = [];
  emissionsCompoundparts: number[] = [];
  emissionsMetals: number[] = [];
  emissionsOther: number[] = [];
  emissionsSteel: number[] = [];

  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  constructor(
    private dataService: DataServiceEmissions,
    private dataColors: DataServiceColors,
    private selectedItemService: SelectedItemService,
    private reductionService: DataServiceReduction,
    private tableUpdateService: TableUpdateService,
    private driveData: TransformationService
  ) {}

  ngOnInit(): void {
   
    this.years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
    this.dataService.getData().subscribe((data) => {
      this['data'] = data;
    });

    this.dataColors.getData().subscribe((color) => {
      this['colorPalette'] = color;
    });

    this.driveData.getMaterials().subscribe((data) => {
      this['materials'] = data;
    });

    let table: MaterialRelatedMeasure[] = [];

    this.selectedItemService.selectedItem$.subscribe((selectedItem) => {
      this.selectedItem = selectedItem;
      this.createBarChart(this.selectedItem, table);
    });

    this.reductionService.getData().subscribe((reduction) => {
      this['reduction'] = reduction;
    });

    this.tableUpdateService.rowAdded.subscribe(
      (tableData: MaterialRelatedMeasure[]) => {
        table = tableData;
        this.createBarChart(this.selectedItem, table);
      }
    );
  }

  private createBarChart(selectedItem: string, table: any[]): void {
    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    this.driveData
      .getEmissions(this.selectedItem, 'Aluminium')
      .subscribe((data) => {
        this.emissionsAluminium = data;
      });

    this.driveData
      .getEmissionsSalesVolume(this.selectedItem, 'Comp. parts')
      .subscribe((data) => {
        this.emissionsCompoundparts = data;
      });
    this.driveData
      .getEmissionsSalesVolume(this.selectedItem, 'Other metals')
      .subscribe((data) => {
        this.emissionsMetals = data;
      });
    this.driveData
      .getEmissionsSalesVolume(this.selectedItem, 'Others')
      .subscribe((data) => {
        this.emissionsOther = data;
      });
    this.driveData
      .getEmissionsSalesVolume(this.selectedItem, 'Steel')
      .subscribe((data) => {
        this.emissionsSteel = data;
      });
   
      let reducedSteel: number[] = [];
      let reducedAluminium: number[] = [];
      let reducedOther: number[] = [];
      let reducedMetal: number[] = [];
      let reducedCompoundParts: number[] = [];
      
      for (let i = 0; i <= table.length - 1; i++) {
        const lastRow = table[i];
      
        if (lastRow.material == 'Steel') {
          const year = lastRow.year;
          const percent = lastRow.percent;
          let i = this.years.findIndex((y) => y === year);
          if (reducedSteel.length > 0) {
            reducedSteel = reducedSteel.map((value, index) => {
              if (index >= i) {
                return value - (value * percent) / 100;
              } else {
                return value;
              }
            });
          } else {
            reducedSteel = this.emissionsSteel.map((value, index) => {
              if (index >= i) {
                return value - (value * percent) / 100;
              } else {
                return value;
              }
            });
          }
        } else if (lastRow.material == 'Other') {
          const year = lastRow.year;
          const percent = lastRow.percent;
          let i = this.years.findIndex((y) => y === year);
          if (reducedOther.length > 0) {
            reducedOther = reducedOther.map((value, index) => {
              if (index >= i) {
                return value - (value * percent) / 100;
              } else {
                return value;
              }
            });
          } else {
            reducedOther = this.emissionsOther.map((value, index) => {
              if (index >= i) {
                return value - (value * percent) / 100;
              } else {
                return value;
              }
            });
          }
        } else if (lastRow.material == 'Aluminium') {
          const year = lastRow.year;
          const percent = lastRow.percent;
          let i = this.years.findIndex((y) => y === year);
          if (reducedAluminium.length > 0) {
            reducedAluminium = reducedAluminium.map((value, index) => {
              if (index >= i) {
                return value - (value * percent) / 100;
              } else {
                return value;
              }
            });
          } else {
            reducedAluminium = this.emissionsAluminium.map((value, index) => {
              if (index >= i) {
                return value - (value * percent) / 100;
              } else {
                return value;
              }
            });
          }
        } else if (lastRow.material == 'Other metals') {
          const year = lastRow.year;
          const percent = lastRow.percent;
          let i = this.years.findIndex((y) => y === year);
          if (reducedMetal.length > 0) {
            reducedMetal = reducedMetal.map((value, index) => {
              if (index >= i) {
                return value - (value * percent) / 100;
              } else {
                return value;
              }
            });
          } else {
            reducedMetal = this.emissionsMetals.map((value, index) => {
              if (index >= i) {
                return value - (value * percent) / 100;
              } else {
                return value;
              }
            });
          }
        } else if (lastRow.material == 'Comp. parts') {
          const year = lastRow.year;
          const percent = lastRow.percent;
          let i = this.years.findIndex((y) => y === year);
          if (reducedCompoundParts.length > 0) {
            reducedCompoundParts = reducedCompoundParts.map((value, index) => {
              if (index >= i) {
                return value - (value * percent) / 100;
              } else {
                return value;
              }
            });
          } else {
            reducedCompoundParts = this.emissionsCompoundparts.map((value, index) => {
              if (index >= i) {
                return value - (value * percent) / 100;
              } else {
                return value;
              }
            });
          }
        }
      }
      

    const data: DataProp[] = this['data'];
    const selectedData = data.filter(
      (item: { product: string }) => item?.product === this.selectedItem
    );
    const selectedProduct = selectedData[0];

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

    const calculateMaxEmission = (): number => {
      const emissionArray: number[] = selectedProduct.sales.map((s) =>
        calculateMaxEmissionPerYear(s)
      );
      return Math.max(...emissionArray);
    };

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

    const colorScale: d3.ScaleOrdinal<string, string> = d3
      .scaleOrdinal<string>()
      .domain(this['materials'])
      .range(this['colorPalette'].slice(0, this['materials'].length));

    const dataLineNewSteel: [number, number][] = this.years.map(
      (year, index) => [year, reducedSteel[index]]
    );

    const dataLineNewAluminium: [number, number][] = this.years.map(
      (year, index) => [year, reducedAluminium[index]]
    );

    const dataLineNewOther: [number, number][] = this.years.map(
      (year, index) => [year, reducedOther[index]]
    );

    
    const dataLineNewMetals: [number, number][] = this.years.map(
      (year, index) => [year, reducedMetal[index]]
    );

    const dataLineNewCompoundparts: [number, number][] = this.years.map(
      (year, index) => [year, reducedCompoundParts[index]]
    );



    const maxEmissions = Math.max(
      Math.max(...this.emissionsAluminium),
      Math.max(...this.emissionsSteel),
      Math.max(...this.emissionsOther),
      Math.max(...this.emissionsCompoundparts),
      Math.max(...this.emissionsMetals)
    );

    const xScale = d3
      .scaleBand()
      .domain(this.years.map(String))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxEmissions + 1])
      .range([height, 0]);

    const x = d3.scaleLinear().domain([2023, 2030]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 10000]).range([height, 0]);

    const lineGenerator = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => yScale(d[1])); // Hier yScale verwenden

    const dataLineAluminium: [number, number][] = this.years.map(
      (year, index) => [year, this.emissionsAluminium[index]]
    );
    const dataLineSteel: [number, number][] = this.years.map((year, index) => [
      year,
      this.emissionsSteel[index],
    ]);

    const dataLineOther: [number, number][] = this.years.map((year, index) => [
      year,
      this.emissionsOther[index],
    ]);
    
    const dataLineMetals: [number, number][] = this.years.map((year, index) => [
      year,
      this.emissionsMetals[index],
    ]);

    
    const dataLineCompoundparts: [number, number][] = this.years.map((year, index) => [
      year,
      this.emissionsCompoundparts[index],
    ]);

    const xAxis = d3
      .axisBottom(x)
      .tickValues(this.years) // Manuell festgelegte Ticks für die x-Achse
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
      .text('Emissions Over Time of Product Materials');
    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .attr('dy', '1em')
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .style('font-size', 12)
      .attr('text-anchor', 'middle')
      .text('Emissions');

    svg
      .append('path')
      .datum(dataLineNewSteel)
      .attr('fill', 'none')
      .attr('stroke', this['colorPalette'][1])
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    svg
      .append('path')
      .datum(dataLineNewOther)
      .attr('fill', 'none')
      .attr('stroke', this['colorPalette'][2])
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

      svg
      .append('path')
      .datum(dataLineNewMetals)
      .attr('fill', 'none')
      .attr('stroke', this['colorPalette'][1])
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);
      svg
      .append('path')
      .datum(dataLineNewCompoundparts)
      .attr('fill', 'none')
      .attr('stroke', this['colorPalette'][1])
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    svg
      .append('path')
      .datum(dataLineNewAluminium)
      .attr('fill', 'none')
      .attr('stroke', this['colorPalette'][0])
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    svg
      .append('path')
      .datum(dataLineAluminium)
      .attr('fill', 'none')
      .attr('stroke', this['colorPalette'][0])
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', lineGenerator);

      svg
      .append('path')
      .datum(dataLineMetals)
      .attr('fill', 'none')
      .attr('stroke', this['colorPalette'][0])
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', lineGenerator);

      svg
      .append('path')
      .datum(dataLineCompoundparts)
      .attr('fill', 'none')
      .attr('stroke', this['colorPalette'][0])
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', lineGenerator);


    svg
      .append('path')
      .datum(dataLineSteel)
      .attr('fill', 'none')
      .attr('stroke', this['colorPalette'][1])
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', lineGenerator);

    svg
      .append('path')
      .datum(dataLineOther)
      .attr('fill', 'none')
      .attr('stroke', this['colorPalette'][2])
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')

      .attr('d', lineGenerator);

    this.createLegend(svg, this['materials'], colorScale);
  }
  private createLegend(
    svg: any,
    materials: string[],
    colorScale: d3.ScaleOrdinal<string, string>
  ): void {
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(-20, ${-40})`);

    const legendItemWidth = 80;
    const legendItemHeight = 17;
    const legendPadding = 0;

    legend
      .selectAll('.legend-item')
      .data(materials)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr(
        'transform',
        (_d: any, i: number) => `translate(${i * legendItemWidth}, 290)`
      );

    legend
      .selectAll('.legend-item')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', legendItemHeight)
      .attr('height', legendItemHeight)
      .style('fill', (d: string) => colorScale(d));

    legend
      .selectAll('.legend-item')
      .append('text')
      .attr('x', legendItemHeight + legendPadding)
      .attr('y', legendItemHeight / 2)
      .attr('dy', '0.35em')
      .text((d: string) => d)
      .style('fill', '#000')
      .style('font-size', '10px')
      .style('font-family', 'Arial');
  }
}
