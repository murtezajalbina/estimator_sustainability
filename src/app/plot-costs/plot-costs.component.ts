import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataServiceColors, DataServiceCosts, DataServiceEmissions, SelectedItemService } from '../cart.service';
import { ToggleService } from '../measures.service';
import { combineLatest} from 'rxjs';

@Component({
  selector: 'app-plot-costs',
  standalone: true,
  templateUrl: './plot-costs.component.html',
  styleUrls: ['../app.component.css']
})

export class PlotCostsComponent implements OnInit {

  [x: string]: any;
selectedItem: string = "default"; 
  private totalMaterialCost: any

  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  constructor(
    private dataService: DataServiceEmissions,
    private dataColors: DataServiceColors,
    private dataCost: DataServiceCosts,
    private selectedItemService: SelectedItemService,
    private toggleService: ToggleService,

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

    /* this.selectedItemService.selectedItem$.subscribe(selectedItem => {
        this.selectedItem = selectedItem;
        this.createLinePlot();
    });

    this.toggleService.toggleChanged.subscribe(() => {
      this.createLinePlot();
    }); */

    combineLatest([
      this.selectedItemService.selectedItem$,
      this.toggleService.toggleChanged
    ]).subscribe(([selectedItem, _]) => {
      this.selectedItem = selectedItem;
      this.createLinePlot();
    });

  }

  get_toggles(rowName: string){
    return this.toggleService.getToggles(rowName);
  }

  private calculateEmmisionCost(cost_per_messure: any,allToggles:any) {
    let totalExtraCostResult = 0;
    for (let i = 0; i < cost_per_messure.length; i++) {
      // Accumulate costs for each material type at the same index
      for (const material in allToggles) {
          if (allToggles[material][i]) {
              totalExtraCostResult += cost_per_messure[i].costs;
          }
      }
  }
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

          if (components.material === "Aluminium") {
            materialCost = components.quantity * sales.volume * cost.Aluminium;
          } else if (components.material === "Steel") {
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

  createChart(data: any, additionalCost?: any) {

    d3.select(this.chartContainer.nativeElement).select('svg').remove();

    const margin = { top: 60, right: 50, bottom: 80, left: 90 };
    const width = 450 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;


    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3
      .scalePoint()
      .domain(data.map((s: any) => s.salesYear))
      .range([0, width])
      .padding(0.5)

    const maxY=data.reduce((acc:any, curr:any) => {
      return acc.totalMaterialCost > curr.totalMaterialCost ? acc : curr;}, data[0]);

  const minY =data.reduce((acc:any, curr:any) => {
    return acc.totalMaterialCost < curr.totalMaterialCost ? acc : curr;
}, data[0]);


    const y = d3.scaleLinear()
      .domain([0, maxY.totalMaterialCost+5000])
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
      .attr("r", 3)
      .attr("cx", (d: any) => x(d.x) || 0)  // Use x scale to position
      .attr("cy", (d: any) => y(d.y) || 0)  // Use y scale to position
      .style("fill", this['colorPalette'][1])
      .on("mouseover", (event: any, d: any) => {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`Total Cost Material: ${d.y} , year: ${d.x}`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY ) + "px");
      })
      .on("mouseout", (d: any) => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    const xScale = d3.scaleLinear().domain(data.map((s: any) => s.salesYear)).range([0, width]);
    const yScale = d3.scaleLinear().domain([minY.totalMaterialCost-5000, maxY.totalMaterialCost+5000]).range([height, 0]);


    const tooltip = d3.select(this.chartContainer.nativeElement)
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);




      if(additionalCost !== 0){

      const dataPointsTotal = data.map((d: any) => ({ x: d.salesYear, y: d.totalMaterialCost + additionalCost }));

      

      svg.append('g')
      .selectAll("dot")
      .data(dataPointsTotal)
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("cx", (d: any) => x(d.x) || 0)  // Use x scale to position
      .attr("cy", (d: any) => y(d.y) || 0)  // Use y scale to position
      .style("fill", this['colorPalette'][2])
      .on("mouseover", (event: any, d: any) => {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`Total Cost Material: ${d.y} , year: ${d.x}`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY ) + "px");
      })
      .on("mouseout", (d: any) => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

      const line2 = d3.line()
      .x((d: any) => x(d.x) || 0)
      .y((d: any) => y(d.y) || 0)
      .curve(d3.curveLinear);
    
    svg.append('path')
      .datum(dataPointsTotal)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 2)
      .attr('stroke', this['colorPalette'][1])
      .attr('d', line2);


      }
      

      const line = d3.line()
      .x((d: any) => x(d.x) || 0)
      .y((d: any) => y(d.y) || 0)
      .curve(d3.curveLinear);
    
    svg.append('path')
      .datum(dataPoints)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 2)
      .attr('stroke', this['colorPalette'][0])
      .attr('d', line);

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 30)
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .style('font-size', 12)
      .text('Year');

    svg
      .append('text')
      .attr('transform', 'translate(-30,' + height / 2.5 + ')rotate(-90)')
      .attr('y', -20)
      .attr('fill', '#000')
         .attr('font-weight', 'bold')
         .style('font-size', 12)
         .attr('text-anchor', 'middle')
      .text('Cost');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Segoe UI')
      .style('font-size', 16)
      .style('font-weight', 'bold')
      .text('Total Cost ');

const legendRectSize = 13;
  
      svg.append("rect").attr("x", width / 2 - 65).attr("y", height + 45).attr('width', legendRectSize)
    .attr('height', legendRectSize).style("fill", this['colorPalette'][0])
  
      svg.append("rect").attr("x", width / 2 - 65).attr("y", height + 60).attr('width', legendRectSize)
    .attr('height', legendRectSize).style("fill", this['colorPalette'][3])
  
      svg.append("text").attr("x", width / 2 -50 ).attr("y", height + 55).text("Costs").style("font-size", "13px").style('font-family', 'Segoe UI')
  svg.append("text").attr("x", width / 2 -50).attr("y", height + 70).text("Costs with measures").style("font-size", "13px").style('font-family', 'Segoe UI');
      
  }


  private createLinePlot() {
    const data = this['data'];
    const cost = this['costs'];

    const allToggles = {
      'Aluminium': this.get_toggles('Aluminium'),
      'Steel': this.get_toggles('Steel'),
      'Other': this.get_toggles('Other')
    };

    this.totalMaterialCost = this.calculateAllMaterialCost(data, cost[0].Kosten_pro_Material);
    if(this.selectedItem !== "default"){
      const selectedData = this.totalMaterialCost.filter((item: { productName: string; }) => item?.productName === this.selectedItem);
    this.createChart(selectedData);

    const emmsionCost = this.calculateEmmisionCost(cost[1].Kosten_pro_Maßnahme,allToggles);
    this.createChart(selectedData, emmsionCost);
}

  }
}
