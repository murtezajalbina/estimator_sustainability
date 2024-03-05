import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataServiceColors, DataServiceCosts, DataServiceEmissions, SelectedItemService } from '../cart.service';
import { select } from 'd3';

@Component({
  selector: 'app-plot-costs',
  standalone: true,
  templateUrl: './plot-costs.component.html',
  styleUrls: ['../app.component.css']
})

export class PlotCostsComponent implements OnInit {

  [x: string]: any;
  selectedItem: string = "default"; 

  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  constructor(
    private dataService: DataServiceEmissions,
    private dataColors: DataServiceColors,
    private dataCost: DataServiceCosts,
    private selectedItemService: SelectedItemService
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
    this.selectedItemService.selectedItem$.subscribe(selectedItem => {
      console.log("Selected Item in ComponentTwo: ", selectedItem);
      this.selectedItem = selectedItem;
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

    const margin = { top: 60, right: 90, bottom: 50, left: 80 };
    const width = 450 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;


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

    const y = d3.scaleLinear()
      .domain([20000, 40000])
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
    const yScale = d3.scaleLinear().domain([20000, 40000]).range([height, 0]);


    const tooltip = d3.select(this.chartContainer.nativeElement)
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

    const line = d3.line()
      .x((d: any) => xScale(d.x) || 0)  // Use x scale to position
      .y((d: any) => yScale(d.y) || 0)  // Use y scale to position
      .curve(d3.curveBasis);

    svg.append("path")
      .datum(dataPoints)
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke", this['colorPalette'][0])
      .style("stroke-width", "2")
      .attr("d", line);

      if(additionalCost !== undefined){

      const dataPointsTotal = data.map((d: any) => ({ x: d.salesYear, y: d.totalMaterialCost + additionalCost }));

        const line2 = d3.line()
      .x((d: any) => xScale(d.x) || 0)  // Use x scale to position
      .y((d: any) => yScale(d.y) || 0)  // Use y scale to position
      .curve(d3.curveBasis);

    svg.append("path")
      .datum(dataPointsTotal)
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke", this['colorPalette'][3])
      .style("stroke-width", "2")
      .attr("d", line2);

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

      }
      

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 25)
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
      .text('Total cost of ' + this.selectedItem);

const legendRectSize = 13;
  svg.append("rect").attr("x",200).attr("y",30).attr('width', legendRectSize)
    .attr('height', legendRectSize).style("fill", this['colorPalette'][0])
  svg.append("rect").attr("x",200).attr("y",50).attr('width', legendRectSize)
    .attr('height', legendRectSize).style("fill", this['colorPalette'][3])
  svg.append("text").attr("x", 215).attr("y", 40).text("totalcost").style("font-size", "12px").style('font-family', 'Segoe UI')
  svg.append("text").attr("x", 215).attr("y", 60).text("totalcost with meassure").style("font-size", "12px").style('font-family', 'Segoe UI')
      
  }


  private createLinePlot() {
    const data = this['data'];
    const cost = this['costs'];

    const totalMaterialCost = this.calculateAllMaterialCost(data, cost[0].Kosten_pro_Material);
    if(this.selectedItem !== "default"){
      console.log(totalMaterialCost);
      console.log(this.selectedItem == "Drive 1" )
      console.log(totalMaterialCost.filter(item => item.productName === "Drive 1"))
      const selectedData = totalMaterialCost.filter(item => item?.productName === this.selectedItem);
      this.createChart(selectedData);

      const emmsionCost = this.calculateEmmisionCost(cost[1].Kosten_pro_Maßnahme);
      this.createChart(selectedData, emmsionCost);
    }
   

   


  }
}

