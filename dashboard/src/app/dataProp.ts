export type DataProp = {
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