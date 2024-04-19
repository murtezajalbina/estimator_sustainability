// data.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DataProp } from './dataProp';

@Injectable({
  providedIn: 'root',
})
export class DataServiceEmissions {
  private data: DataProp[] = [
    {
      product: 'Drive 1',
      sales: [
        {
          year: 2023,
          volume: 200,
          components: [
            { material: 'Aluminium', quantity: 4, emission: 3 },
            { material: 'Steel', quantity: 5, emission: 6 },
            { material: 'Other', quantity: 6, emission: 4 },
          ],
        },
        {
          year: 2024,
          volume: 210,
          components: [
            { material: 'Aluminium', quantity: 5, emission: 4 },
            { material: 'Steel', quantity: 6, emission: 7 },
            { material: 'Other', quantity: 7, emission: 5 },
          ],
        },
        {
          year: 2025,
          volume: 220,
          components: [
            { material: 'Aluminium', quantity: 6, emission: 5 },
            { material: 'Steel', quantity: 7, emission: 8 },
            { material: 'Other', quantity: 8, emission: 6 },
          ],
        },
        {
          year: 2026,
          volume: 230,
          components: [
            { material: 'Aluminium', quantity: 7, emission: 6 },
            { material: 'Steel', quantity: 8, emission: 9 },
            { material: 'Other', quantity: 9, emission: 7 },
          ],
        },
        {
          year: 2027,
          volume: 150,
          components: [
            { material: 'Aluminium', quantity: 8, emission: 7 },
            { material: 'Steel', quantity: 9, emission: 10 },
            { material: 'Other', quantity: 10, emission: 8 },
          ],
        },
        {
          year: 2028,
          volume: 200,
          components: [
            { material: 'Aluminium', quantity: 9, emission: 8 },
            { material: 'Steel', quantity: 10, emission: 11 },
            { material: 'Other', quantity: 11, emission: 9 },
          ],
        },
        {
          year: 2029,
          volume: 120,
          components: [
            { material: 'Aluminium', quantity: 10, emission: 9 },
            { material: 'Steel', quantity: 11, emission: 12 },
            { material: 'Other', quantity: 12, emission: 10 },
          ],
        },
        {
          year: 2030,
          volume: 130,
          components: [
            { material: 'Aluminium', quantity: 11, emission: 10 },
            { material: 'Steel', quantity: 12, emission: 13 },
            { material: 'Other', quantity: 13, emission: 11 },
          ],
        },
      ],
    },  
    {
      product: 'Drive 2',
      sales: [
        {
          year: 2023,
          volume: 180,
          components: [
            { material: 'Aluminium', quantity: 3, emission: 2 },
            { material: 'Steel', quantity: 4, emission: 5 },
            { material: 'Other', quantity: 5, emission: 3 },
          ],
        },
        {
          year: 2024,
          volume: 190,
          components: [
            { material: 'Aluminium', quantity: 4, emission: 3 },
            { material: 'Steel', quantity: 5, emission: 6 },
            { material: 'Other', quantity: 6, emission: 4 },
          ],
        },
        {
          year: 2025,
          volume: 200,
          components: [
            { material: 'Aluminium', quantity: 5, emission: 4 },
            { material: 'Steel', quantity: 6, emission: 7 },
            { material: 'Other', quantity: 7, emission: 5 },
          ],
        },
        {
          year: 2026,
          volume: 210,
          components: [
            { material: 'Aluminium', quantity: 6, emission: 5 },
            { material: 'Steel', quantity: 7, emission: 8 },
            { material: 'Other', quantity: 8, emission: 6 },
          ],
        },
        {
          year: 2027,
          volume: 220,
          components: [
            { material: 'Aluminium', quantity: 7, emission: 6 },
            { material: 'Steel', quantity: 8, emission: 9 },
            { material: 'Other', quantity: 9, emission: 7 },
          ],
        },
        {
          year: 2028,
          volume: 230,
          components: [
            { material: 'Aluminium', quantity: 8, emission: 7 },
            { material: 'Steel', quantity: 9, emission: 10 },
            { material: 'Other', quantity: 10, emission: 8 },
          ],
        },
        {
          year: 2029,
          volume: 240,
          components: [
            { material: 'Aluminium', quantity: 9, emission: 8 },
            { material: 'Steel', quantity: 10, emission: 11 },
            { material: 'Other', quantity: 11, emission: 9 },
          ],
        },
        {
          year: 2030,
          volume: 250,
          components: [
            { material: 'Aluminium', quantity: 10, emission: 9 },
            { material: 'Steel', quantity: 11, emission: 12 },
            { material: 'Other', quantity: 12, emission: 10 },
          ],
        },
      ],
    },
  ];

  getData(): Observable<any[]> {
    return of(this.data);
  }

 
}

@Injectable({
  providedIn: 'root',
})
export class DataServiceReduction {
  private reduction = [
    {
      messure_reduction: [
      { measure: 'process efficiency', reduction: 0.2 },
      { measure: 'switch technology', reduction: 0.15 },
      { measure: 'reduce waste', reduction: 0.1 },
      { measure: 'green compounds', reduction: 0.25 },
      ],
    },
  ];

  getData(): Observable<any[]> {
    return of(this.reduction);
  }
}

@Injectable({
  providedIn: 'root'
})
export class SelectedItemService {
  private selectedItemSubject = new BehaviorSubject<string>("Drive C1");
  selectedItem$ = this.selectedItemSubject.asObservable();

  updateSelectedItem(selectedItem: string) {
    this.selectedItemSubject.next(selectedItem);
  }

  getSelectedItem(): string {
    return this.selectedItemSubject.value;
  }
}



@Injectable({
  providedIn: 'root',
})
export class DataServiceCosts {
  private costs = [
    {
      Kosten_pro_Material: {
        Aluminium: 7,
        Steel: 7,
        Other: 7,
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
