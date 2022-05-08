import { ICarDetail, IExcelHeader, IStoreItems, ITableHeader } from "./interfaces";

export const _excelHeader: IExcelHeader = {
    "ID" : 'id',
    "Название": "name",
    "Количество": "amount",
    "Цена": "price",
    "Стоимость": "cost"
}

export const _header: ITableHeader[] = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Деталь",
  },
  {
    key: "amount",
    label: "Количество",
  },
  {
    key: "price",
    label: "Цена",
  },
  {
    key: "cost",
    label: "Стоимость",
  },
  {
    key: "actions",
    label: "Действия",
  },
];

export const _items: ICarDetail[] = [
  {
    id: "#1",
    name: "Кузов",
    amount: 1,
    price: 0,
    cost: 0,
  },
  {
    id: "#2",
    name: "Двигатель",
    amount: 2,
    price: 0,
    cost: 0,
  },
];

export const _defaultItems: ICarDetail = {
  id: 0,
  name: "",
  amount: 1,
  price: 0,
  cost: 0,
};

export const _defaultStoreItems: IStoreItems = {
  "#1": {
    index: 0,
    children_count: 0,
  },
  "#2": {
    index: 1,
    children_count: 0,
  },
};

export const getDefaultId = (store: IStoreItems, targetId: ICarDetail['id']) => {
  return store[targetId].children_count + 1;
};
