// data.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataServiceEmissions {
  private data = [
    {
      product: 'Drive 1',
      sales: [
        {
          year: 2020,
          volume: 100,
          components: [
            { material: 'aluminium', quantity: 12, emission: 8 },
            { material: 'steel', quantity: 4, emission: 5 },
            { material: 'other', quantity: 5, emission: 3 },
          ],
        },
        {
          year: 2021,
          volume: 80,
          components: [
            { material: 'aluminium', quantity: 12, emission: 8 },
            { material: 'steel', quantity: 4, emission: 5 },
            { material: 'other', quantity: 5, emission: 3 },
          ],
        },
      ],
    },
    {
      product: 'Drive 2',
      sales: [
        {
          year: 2020,
          volume: 120,
          components: [
            { material: 'aluminium', quantity: 10, emission: 7 },
            { material: 'steel', quantity: 6, emission: 4 },
            { material: 'other', quantity: 4, emission: 2 },
          ],
        },
        {
          year: 2021,
          volume: 90,
          components: [
            { material: 'aluminium', quantity: 10, emission: 7 },
            { material: 'steel', quantity: 6, emission: 4 },
            { material: 'other', quantity: 4, emission: 2 },
          ],
        },
      ],
    },
    { measure: 'process efficiency', reduction: 0.2 },
    { measure: 'switch technology', reduction: 0.15 },
    { measure: 'reduce waste', reduction: 0.1 },
    { measure: 'green compounds', reduction: 0.25 },
  ];

  getData(): Observable<any[]> {
    return of(this.data);
  }
}



@Injectable({
  providedIn: 'root',
})
export class DataServiceCosts {
  private costs = [
    {
      Kosten_pro_Material: {
        Aluminium: 20,
        Steel: 5,
        Other: 10,
      },
    },

    {
      Kosten_pro_Maßnahme: [
        { measure: 'process efficacy', costs: 560 },
        { measure: 'switch technology', costs: 400 },
        { measure: 'reduce waste', costs: 208 },
        { measure: 'green compounds', costs: 600 },
      ],
    },
  ];

  getData(): Observable<any[]> {
    return of(this.costs);
  }
}



@Injectable({
  providedIn: 'root',
})
export class DataServiceROI {
  private roidata = [
    {
      Einnahmen_pro_Produkt: [
        { Produkt: 'Drive 1', Einnahmen: 30 },
        { Produkt: 'Drive 2', Einnahmen: 70 },
      ],
    },
  ];

  getData(): Observable<any[]> {
    return of(this.roidata);
  }
}


@Injectable({
  providedIn: 'root',
})
export class DataServiceColors {
  private colors = {
    name: 'Climate Action Plan',
    dataColors: [
      '#195B7F',
      '#2589BE',
      '#5AC5FD',
      '#BBE7FF',
      '#192A7F',
      '#07A7F7',
      '#9EC2FD',
      '#0095FF',
    ],
    background: '#FAF9F8',
    foreground: '#000000',
    tableAccent: '#31B6FD',
    visualStyles: {
      '*': {
        '*': {
          outspace: [{ color: { solid: { color: '#FAF9F8' } } }],
          background: [
            { color: { solid: { color: '#FFFFFF' } }, transparency: 0 },
          ],
          visualTooltip: [
            {
              titleFontColor: { solid: { color: '#C8C8C8' } },
              valueFontColor: { solid: { color: '#EAEAEA' } },
              background: { solid: { color: '#000000' } },
            },
          ],
          visualHeaderTooltip: [
            {
              titleFontColor: { solid: { color: '#C8C8C8' } },
              background: { solid: { color: '#000000' } },
            },
          ],
          outspacePane: [
            { checkboxAndApplyColor: { solid: { color: '#0095FF' } } },
          ],
          filterCard: [{ $id: 'Available', textSize: 8 }],
        },
      },
      page: {
        '*': {
          background: [
            { color: { solid: { color: '#FFFFFF' } }, transparency: 100 },
          ],
        },
      },
    },
    bad: '#FF001A',
    neutral: '#0ACCFD',
    good: '#00B12E',
    minimum: '#E5F2FE',
    center: '#67B6FF',
    maximum: '#0084FD',
    textClasses: {
      label: {
        fontFace:
          "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif",
        fontSize: 11,
      },
      header: { fontFace: 'wf_standard-font, helvetica, arial, sans-serif' },
    },
  };
  
  getData(): Observable<any[]> {
    return of(this.colors.dataColors);
  }
}
