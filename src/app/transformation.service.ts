import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

type Item = {
  'REFE Bezeichnung': string;
  'REFE DB': string;
  Level: number;
  Name: string;
  Quantity: string;
  'CO₂ Footprint': number;
  Year: number;
  'Material Group Identifier': string;
  'Product-ID': number;
  Costs: number;
};

interface VolumeData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class TransformationService {
  private driveData: Item[] = [
    {
      'REFE Bezeichnung': 'Drive C1',
      'REFE DB': 'Drive-105',
      Level: 2,
      Name: '.. Traction motor with brake',
      Quantity: '2,00',
      'CO₂ Footprint': 267.07,
      Year: 2023,
      'Material Group Identifier': 'Aluminium',
      'Product-ID': 1,
      Costs: 40,
    },
    {
      'REFE Bezeichnung': 'Drive C1',
      'REFE DB': 'Drive-105',
      Level: 2,
      Name: '.. Wheel 5710.4118.97-Z',
      Quantity: '1,00',
      'CO₂ Footprint': 101.81,
      Year: 2023,
      'Material Group Identifier': 'Comp. parts',
      'Product-ID': 1,
      Costs: 25,
    },
    {
      'REFE Bezeichnung': 'Drive C1',
      'REFE DB': 'Drive-105',
      Level: 2,
      Name: '.. Nameplate (19190231)',
      Quantity: '1,00',
      'CO₂ Footprint': 0.01,
      Year: 2023,
      'Material Group Identifier': 'Other metals',
      'Product-ID': 1,
      Costs: 38,
    },
    {
      'REFE Bezeichnung': 'Drive C1',
      'REFE DB': 'Drive-105',
      Level: 2,
      Name: '.. Grease',
      Quantity: '2,75',
      'CO₂ Footprint': 12.71,
      Year: 2023,
      'Material Group Identifier': 'Others',
      'Product-ID': 1,
      Costs: 65,
    },
    {
      'REFE Bezeichnung': 'Drive C1',
      'REFE DB': 'Drive-105',
      Level: 2,
      Name: '.. Traction drive R003',
      Quantity: '1,00',
      'CO₂ Footprint': 741.87,
      Year: 2023,
      'Material Group Identifier': 'Steel',
      'Product-ID': 1,
      Costs: 34,
    },
    {
      'REFE Bezeichnung': 'Drive C2',
      'REFE DB': 'Drive-106',
      Level: 2,
      Name: '.. Traction motor with brake',
      Quantity: '2,00',
      'CO₂ Footprint': 367.07,
      Year: 2023,
      'Material Group Identifier': 'Aluminium',
      'Product-ID': 1,
      Costs: 50,
    },
    {
      'REFE Bezeichnung': 'Drive C2',
      'REFE DB': 'Drive-106',
      Level: 2,
      Name: '.. Wheel 5710.4118.97-Z',
      Quantity: '1,00',
      'CO₂ Footprint': 201.81,
      Year: 2023,
      'Material Group Identifier': 'Comp. parts',
      'Product-ID': 1,
      Costs: 35,
    },
    {
      'REFE Bezeichnung': 'Drive C2',
      'REFE DB': 'Drive-106',
      Level: 2,
      Name: '.. Nameplate (19190231)',
      Quantity: '1,00',
      'CO₂ Footprint': 1.01,
      Year: 2023,
      'Material Group Identifier': 'Other metals',
      'Product-ID': 1,
      Costs: 39,
    },
    {
      'REFE Bezeichnung': 'Drive C2',
      'REFE DB': 'Drive-106',
      Level: 2,
      Name: '.. Grease',
      Quantity: '2,75',
      'CO₂ Footprint': 22.71,
      Year: 2023,
      'Material Group Identifier': 'Others',
      'Product-ID': 1,
      Costs: 43,
    },
    {
      'REFE Bezeichnung': 'Drive C2',
      'REFE DB': 'Drive-106',
      Level: 2,
      Name: '.. Traction drive R003',
      Quantity: '1,00',
      'CO₂ Footprint': 841.87,
      Year: 2023,
      'Material Group Identifier': 'Steel',
      'Product-ID': 1,
      Costs: 47,
    },
    {
      'REFE Bezeichnung': 'Drive C3',
      'REFE DB': 'Drive-107',
      Level: 2,
      Name: '.. Traction motor with brake',
      Quantity: '2,00',
      'CO₂ Footprint': 267.07,
      Year: 2023,
      'Material Group Identifier': 'Aluminium',
      'Product-ID': 1,
      Costs: 51,
    },
    {
      'REFE Bezeichnung': 'Drive C3',
      'REFE DB': 'Drive-107',
      Level: 2,
      Name: '.. Wheel 5710.4118.97-Z',
      Quantity: '1,00',
      'CO₂ Footprint': 101.81,
      Year: 2023,
      'Material Group Identifier': 'Comp. parts',
      'Product-ID': 1,
      Costs: 55,
    },
    {
      'REFE Bezeichnung': 'Drive C3',
      'REFE DB': 'Drive-107',
      Level: 2,
      Name: '.. Nameplate (19190231)',
      Quantity: '1,00',
      'CO₂ Footprint': 0.01,
      Year: 2023,
      'Material Group Identifier': 'Other metals',
      'Product-ID': 1,
      Costs: 59,
    },
    {
      'REFE Bezeichnung': 'Drive C3',
      'REFE DB': 'Drive-107',
      Level: 2,
      Name: '.. Grease',
      Quantity: '2,75',
      'CO₂ Footprint': 12.71,
      Year: 2023,
      'Material Group Identifier': 'Others',
      'Product-ID': 1,
      Costs: 63,
    },
    {
      'REFE Bezeichnung': 'Drive C3',
      'REFE DB': 'Drive-107',
      Level: 2,
      Name: '.. Traction drive R003',
      Quantity: '1,00',
      'CO₂ Footprint': 741.87,
      Year: 2023,
      'Material Group Identifier': 'Steel',
      'Product-ID': 1,
      Costs: 67,
    },
    {
      'REFE Bezeichnung': 'Drive C4',
      'REFE DB': 'Drive-108',
      Level: 2,
      Name: '.. Traction motor with brake',
      Quantity: '2,00',
      'CO₂ Footprint': 267.07,
      Year: 2023,
      'Material Group Identifier': 'Aluminium',
      'Product-ID': 1,
      Costs: 71,
    },
    {
      'REFE Bezeichnung': 'Drive C4',
      'REFE DB': 'Drive-108',
      Level: 2,
      Name: '.. Wheel 5710.4118.97-Z',
      Quantity: '1,00',
      'CO₂ Footprint': 101.81,
      Year: 2023,
      'Material Group Identifier': 'Comp. parts',
      'Product-ID': 1,
      Costs: 75,
    },
    {
      'REFE Bezeichnung': 'Drive C4',
      'REFE DB': 'Drive-108',
      Level: 2,
      Name: '.. Nameplate (19190231)',
      Quantity: '1,00',
      'CO₂ Footprint': 0.01,
      Year: 2023,
      'Material Group Identifier': 'Other metals',
      'Product-ID': 1,
      Costs: 79,
    },
    {
      'REFE Bezeichnung': 'Drive C4',
      'REFE DB': 'Drive-108',
      Level: 2,
      Name: '.. Grease',
      Quantity: '2,75',
      'CO₂ Footprint': 12.71,
      Year: 2023,
      'Material Group Identifier': 'Others',
      'Product-ID': 1,
      Costs: 83,
    },
    {
      'REFE Bezeichnung': 'Drive C4',
      'REFE DB': 'Drive-108',
      Level: 2,
      Name: '.. Traction drive R003',
      Quantity: '1,00',
      'CO₂ Footprint': 741.87,
      Year: 2023,
      'Material Group Identifier': 'Steel',
      'Product-ID': 1,
      Costs: 87,
    },
  ];
  private years: string[] = [
    '2023',
    '2024',
    '2025',
    '2026',
    '2027',
    '2028',
    '2029',
    '2030',
  ];
  private materials: string[] = Array.from(
    new Set(this.driveData.map((item) => item['Material Group Identifier']))
  );
  private products: string[] = Array.from(
    new Set(this.driveData.map((item) => item['REFE Bezeichnung']))
  );

  getYears(): Observable<any[]> {
    return of(this.years);
  }

  getVolumes(drive: string) {
    let volumes: number[];
    switch (drive) {
      case 'Drive C1':
        volumes = [
          1254.0, 1889.0, 2524.0, 3159.0, 3794.0, 3929.0, 3929.0, 3429.0,
        ];
        break;
      case 'Drive C2':
        volumes = [
          1044.0, 1420.0, 1796.0, 2300.0, 2300.0, 2300.0, 2500.0, 2676.0,
        ];
        break;
      case 'Drive C3':
        volumes = [254.0, 349.0, 664.0, 1859.0, 2394.0, 2929.0, 3264.0, 4499.0];
        break;
      case 'Drive C4':
        volumes = [1954.0, 789.0, 624.0, 559.0, 294.0, 229.0, 0.0, 0.0];
        break;
      default:
        volumes = [];
        break;
    }
    return volumes;
  }

  getEmissions(drive: string, material: string): Observable<number[]> {
    if (drive === 'default') {
      drive = "Drive C1"
    }
    const drive1Data = this.driveData.filter(
      (item) => item['REFE Bezeichnung'] === drive
    );
    const materialData = drive1Data.filter(
      (item) => item['Material Group Identifier'] === material
    );

    const e = materialData[0]['CO₂ Footprint']
    const q = parseFloat(materialData[0]['Quantity'])
    
  const emissionsArray = new Array(8).fill(q*e)

    return of(emissionsArray)
  }
  
  getEmissionsSalesVolume(drive: string, material: string): Observable<number[]> {
    let volumes = this.getVolumeData(drive);
    let emissionsObservable = this.getEmissions(drive, material);

  
    return emissionsObservable.pipe(
      map((emissions) => {
        return volumes.map((volume, index) => volume * emissions[index]);
      })
    );
  }
  

  getMaterials(): Observable<any[]> {
    return of(this.materials);
  }

  getProducts(): Observable<any> {
    return of(this.products);
  }

  private volumeData: VolumeData[] = [
    {
      Bezeichnung: 'Drive C1',
      Volume_2023: '1254.00',
      Volume_2024: '1889.00',
      Volume_2025: '2524.00',
      Volume_2026: '3159.00',
      Volume_2027: '3794.00',
      Volume_2028: '3929.00',
      Volume_2029: '3929.00',
      Volume_2030: '3429.00',
    },
    {
      Bezeichnung: 'Drive C2',
      Volume_2023: 1044.0,
      Volume_2024: 1420.0,
      Volume_2025: 1796.0,
      Volume_2026: 2300.0,
      Volume_2027: 2300.0,
      Volume_2028: 2300.0,
      Volume_2029: 2500.0,
      Volume_2030: 2676.0,
    },
    {
      Bezeichnung: 'Drive C3',
      Volume_2023: 254.0,
      Volume_2024: 349.0,
      Volume_2025: 664.0,
      Volume_2026: 1859.0,
      Volume_2027: 2394.0,
      Volume_2028: 2929.0,
      Volume_2029: 3264.0,
      Volume_2030: 4499.0,
    },
    {
      Bezeichnung: 'Drive C4',
      Volume_2023: 1954.0,
      Volume_2024: 789.0,
      Volume_2025: 624.0,
      Volume_2026: 559.0,
      Volume_2027: 294.0,
      Volume_2028: 229.0,
      Volume_2029: 0.0,
      Volume_2030: 0.0,
    },
  ];

  getCosts(drive: string): Observable<any[]> {
    /*  let totalCosts = 0;
  const drive1Data = this.driveData.filter((item) => item['REFE Bezeichnung'] === drive);
  drive1Data.forEach((item) => {
    const quantity = parseFloat(item.Quantity.replace(',', '.'));
    totalCosts += quantity * item.Costs;
  });


  const filteredVolumeData = this.volumeData.filter((item) => item["Bezeichnung"] === drive);
  filteredVolumeData.forEach((item) => {
    sales.push((sale) => {

    })
  });
  
  const sales = this.years.map((year) => {
    const index = 'Volume_' + year.toString();
    const filtered = filteredVolumeData![index];
  });
return of(sales)   */

    let totalCosts = 0;
    const drive1Data = this.driveData.filter(
      (item) => item['REFE Bezeichnung'] === drive
    );
    drive1Data.forEach((item) => {
      const quantity = parseFloat(item.Quantity.replace(',', '.'));
      totalCosts += quantity * item.Costs;
    });
    let volumes = this.getVolumeData(drive);

    const totalCostsTimesVolumes = volumes.map((volume) => totalCosts * volume);
    return of(totalCostsTimesVolumes);
  }

  getVolumeData(drive: string){
    const data = this.volumeData.find(item => item['Bezeichnung'] === drive);
    if (data) {
      const volumeArray: number[] = [];
      // Iteriere über die Schlüssel-Werte-Paare im Volume-Objekt
      Object.keys(data).forEach(key => {
        if (key.startsWith('Volume_')) {
          volumeArray.push(parseFloat(data[key])); // Konvertiere den Wert zu einer Zahl und füge ihn dem Array hinzu
        }
      });
      return (volumeArray);
    } else {
      return ([]); // Falls kein passendes Drive gefunden wurde, ein leeres Array zurückgeben
    }
  }


  getSalesvolume(): Observable<any[]> {
    return of(this.years);
  }
}
