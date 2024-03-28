import {
  Component,
  ElementRef,
  OnInit,
  OnChanges,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';
import {
  DataServiceEmissions,
  DataServiceColors,
  SelectedItemService,
} from '../cart.service';
import { DataProp } from '../dataProp';
import { SelectedValuesService } from '../measures.service';
import { DataServiceReduction } from '../cart.service';
import { privateDecrypt } from 'crypto';
import { MaterialRelatedMeasure } from '../material-related-measure';
import { DoCheck } from '@angular/core';
import { table } from 'console';

@Component({
  selector: 'app-plot-emissions',
  standalone: true,
  imports: [],
  templateUrl: './plot-emissions.component.html',
  styleUrls: ['../app.component.css'],
  template: ` <div>{{ receivedData }}</div>`,
})
export class PlotEmissionsComponent implements OnInit {
  @Input() receivedData: MaterialRelatedMeasure[] | undefined;

  [x: string]: any;
  selectedItem: string = 'default';
  emissionAluminium: any = [];
  emissionSteel: any = [];
  emissionOther: any = [];

  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  constructor(
    private dataService: DataServiceEmissions,
    private dataColors: DataServiceColors,
    private SelectedValueService: SelectedValuesService,
    private selectedItemService: SelectedItemService,
    private reductionService: DataServiceReduction
  ) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe((data) => {
      this['data'] = data;
    });

    this.dataColors.getData().subscribe((color) => {
      this['colorPalette'] = color;
    });

    const table: MaterialRelatedMeasure[] = [
      {
        material: 'Aluminium',
        measure: 'Green Compounds',
        year: 2026,
        percent: 80,
      },
      {
        material: 'Steel',
        measure: 'Green Compounds',
        year: 2028,
        percent: 65,
      },
      {
        material: 'Other',
        measure: 'Green Compounds',
        year: 2028,
        percent: 40,
      },
      {
        material: 'Steel',
        measure: 'Green Compounds',
        year: 2024,
        percent: 40,
      },
    ];
    this.selectedItemService.selectedItem$.subscribe((selectedItem) => {
      this.selectedItem = selectedItem;
      this.createBarChart(this.selectedItem, table);
    });

    this.reductionService.getData().subscribe((reduction) => {
      this['reduction'] = reduction;
    });

    /* this.SelectedValueService.toggleChanged.subscribe(() => {
      this.createBarChart(this.selectedItem);
    }); */
  }

  /*   get_toggles(rowName: string) {
    return this.toggleService.getToggles(rowName);
  } */

  private createBarChart(selectedItem: string, table: any[]): void {
    let years: number[];
    let emissionsAluminium: number[];
    let emissionsSteel: number[];
    let emissionsOther: number[];

    if (selectedItem == 'Drive 1') {
      years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
      emissionsAluminium = [3200, 2800, 3900, 4100, 3700, 4300, 3800, 3400];
      emissionsSteel = [5200, 4800, 4400, 5100, 4900, 4700, 5500, 5000];
      emissionsOther = [3000, 3700, 3500, 3300, 3800, 3200, 3900, 3600];
    } else {
      years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
      emissionsAluminium = [7000, 5000, 2000, 4100, 3700, 4300, 3800, 3400];
      emissionsSteel = [5200, 4800, 4400, 5100, 4900, 4700, 5500, 5000];
      emissionsOther = [3000, 3700, 3500, 3300, 3800, 3200, 3900, 3600];
    }

    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    let reducedSteel: number[] = [];
    let reducedAluminium: number[] = [];
    let reducedOther: number[] = [];


    for (let i = 0; i <= table.length - 1; i++) {
      
      const lastRow = table[i];
      if (lastRow.material == 'Steel') {
        const year = lastRow.year;
        const percent = lastRow.percent;
        let i = years.findIndex(y => y === year);
        console.log(i);
        if (reducedSteel.length > 0) {
        reducedSteel = reducedSteel.map((value, index) => {
          if (index >= i) {
            return value - (value * percent / 100);
          } else {
            return value;
          }
        
        });

      } else { 
  
        reducedSteel = emissionsSteel.map((value, index) => {
          if (index >= i) {
            return value - (value * percent / 100);
          } else {
            return value;
          }
        });

      }
    }
    else if (lastRow.material == 'Other') {

        const year = lastRow.year;
        const percent = lastRow.percent;
        let i = years.findIndex(y => y === year);
        console.log(i);
        reducedOther = emissionsOther.map((value, index) => {
          if (index >= i) {
            return value - (value * percent / 100);
          } else {
            return value;
          }
        });
        console.log(reducedOther);
    } else {
      if (lastRow.material == 'Aluminium') {
        const year = lastRow.year;
        const percent = lastRow.percent;
        let i = years.findIndex(y => y === year);
        console.log(i);
        reducedAluminium = emissionsAluminium.map((value, index) => {
          if (index >= i) {
            return value - (value * percent / 100);
          } else {
            return value;
          }
        });
        console.log(reducedAluminium);
      }
    }
  }

    /* 
    const allToggles: any = {
      Aluminium: this.get_toggles('Aluminium'),
      Steel: this.get_toggles('Steel'),
      Other: this.get_toggles('Other'),
    }; 

    const isAluminiumTrue = allToggles['Aluminium'].some(
      (value: boolean) => value
    );

    const isSteelTrue = allToggles['Steel'].some(
      (value: boolean) => value
    );
    const isOtherTrue = allToggles['Other'].some(
      (value: boolean) => value
    );
 */
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

    const materials = selectedProduct.sales[0].components.map(
      (m) => m.material
    );

    const colorScale: d3.ScaleOrdinal<string, string> = d3
      .scaleOrdinal<string>()
      .domain(materials)
      .range(this['colorPalette'].slice(0, materials.length));


    const dataLineNewSteel: [number, number][] = years.map((year, index) => [
      year,
      reducedSteel[index],
    ]);

    const dataLineNewAluminium: [number, number][] = years.map((year, index) => [
      year,
      reducedAluminium[index],
    ]);

    const dataLineNewOther: [number, number][] = years.map((year, index) => [
      year,
      reducedOther[index],
    ]);

    function createLineGenerator(dataLine: [number, number][]): any {
      return d3.line()(<any>dataLine);
    }


    const maxEmissions = Math.max(
      Math.max(...emissionsAluminium),
      Math.max(...emissionsSteel),
      Math.max(...emissionsOther)
    );

    const xScale = d3
      .scaleBand()
      .domain(years.map(String))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxEmissions])
      .range([height, 0]);

    const x = d3.scaleLinear().domain([2023, 2030]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 10000]).range([height, 0]);

    const lineGenerator = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    const dataLineAluminium: [number, number][] = years.map((year, index) => [
      year,
      emissionsAluminium[index],
    ]);
    const dataLineSteel: [number, number][] = years.map((year, index) => [
      year,
      emissionsSteel[index],
    ]);
    const dataLineOther: [number, number][] = years.map((year, index) => [
      year,
      emissionsOther[index],
    ]);

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
      .append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Segoe UI')
      .style('font-size', 16)
      .style('font-weight', 'bold')
      .text('Emissions Over Time ');
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
      .text('Emissions');

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
      .datum(dataLineNewAluminium)
      .attr('fill', 'none')
      .attr('stroke', this['colorPalette'][0])
      .attr('stroke-width', 2)
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

    this.createLegend(svg, materials, colorScale);
  }

  private createLegend(
    svg: d3.Selection<any, unknown, null, undefined>,
    materials: string[],
    colorScale: d3.ScaleOrdinal<string, string>
  ): void {
    const margin = { top: 60, right: 50, bottom: 80, left: 90 };
    const width = 450 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const legend = svg
      .append('g')
      .attr(
        'transform',
        'translate(' + margin.left + ',' + (height + margin.top - 10) + ')'
      ); // Hier wurde die y-Koordinate angepasst

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
function createDataLine(
  years: number[],
  emissionsAluminium: number[]
): [number, number][] {
  throw new Error('Function not implemented.');
}


    /* // Add x axis
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // Add y axis
    svg.append('g').call(d3.axisLeft(y));
    const maxEmission = calculateMaxEmission();

    this.emissionAluminium = selectedProduct.sales.map((s) =>
      calculateEmission(s, s.volume)
    );

    function processDataAluminium(
      selectedProduct: any, material: string
    ): { productName: string; salesYear: number; emission: number }[] {
      let resultArray: {
        productName: string;
        salesYear: number;
        emission: number;
      }[] = [];

      selectedProduct.sales.forEach((sales: any) => {
        let dataAluminium = {
          productName: selectedProduct.product,
          salesYear: sales.year,
          emission: 0,
        };

        sales.components.forEach((comp: any) => {
          let data_aluminium;

          if (comp.material === material) {
            data_aluminium = calculateEmission(comp, sales.volume);
          } else if (comp.material === 'Steel') {
            data_aluminium = 0;
          } else {
            data_aluminium = 0;
          }

          dataAluminium.emission += data_aluminium;
        });

        resultArray.push(dataAluminium);
      });

      return resultArray;
    } */

    /*  const emissionsAluminium = processDataAluminium(selectedProduct, 'Aluminium').map(
      (item) => item.emission
    );
    const emissionsSteel = processDataAluminium(selectedProduct, 'Steel').map(
      (item) => item.emission
    );
    const emissionsOther = processDataAluminium(selectedProduct, 'Other').map(
      (item) => item.emission
    ); */

    /*     
    const dataLineAluminium: [number, number][] = createDataLine(years, emissionsAluminium);
    const dataLineSteel: [number, number][] = createDataLine(years, emissionsSteel);
    const dataLineOther: [number, number][] = createDataLine(years, emissionsOther);
     */
    /* 
    function createLineGenerator(dataLine: [number, number][]): any {
      return d3.line()(<any>dataLine);
    }
    
    const lineGeneratorAluminium = createLineGenerator(dataLineAluminium);
    const lineGeneratorSteel = createLineGenerator(dataLineSteel);
    const lineGeneratorOther = createLineGenerator(dataLineOther);  */
