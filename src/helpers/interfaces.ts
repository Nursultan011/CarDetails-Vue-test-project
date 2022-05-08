export interface ICarDetail {
  name: string;
  price: number;
  amount: number;
  cost: number;
  id: number | string;
  [key: string]: number | string;
}

export interface ITableHeader {
  key: string;
  sortable?: boolean;
  label: string;
}

export interface IStoreItemsValue {
  parent_id?: number | string;
  index: number;
  children_count: number;
}

export interface IStoreItems {
  [key: string]: IStoreItemsValue;
}

export interface IExcelHeader {
  [key: string]: string;
}
