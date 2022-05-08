<template>
  <div class="mx-5">
    <!-- library to download excel -->
    <download-excel
      class="btn btn-default"
      :data="items"
      :fields="_excelHeader"
      name="filename.xls"
    >
      <b-button>Скачать excel файл</b-button>
    </download-excel>
    <!-- html table -->
    <b-table
      striped
      hover
      :items="items"
      :fields="fields"
      :bordered="true"
      id="table"
    >
      <template #cell(name)="{ item }">
        <b-form-input v-model="item.name"></b-form-input>
      </template>
      <template #cell(price)="{ item }">
        <b-form-input
          v-model="item.price"
          v-if="!isChildrenExist(item)"
          type="number"
          @change="(e) => onNumbersChange(e, item)"
        ></b-form-input>
        <span v-else>
          {{ item.price }}
        </span>
      </template>
      <template #cell(amount)="{ item }">
        <b-form-input v-model="item.amount" type="number"></b-form-input>
      </template>
      <template #cell(cost)="{ item }">
        <span>{{ calculateCost(item) }}</span>
      </template>
      <template #cell(id)="{ item }">
        <span>{{ item.id }}</span>
      </template>
      <template #cell(actions)="{ item, index }">
        <b-button variant="secondary" size="sm" @click="addRow(item.id, index)"
          >Добавить</b-button
        >
        <b-button
          variant="danger"
          class="ml-2"
          size="sm"
          @click="removeRow(item.id, index)"
          >Удалить</b-button
        >
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import {
  ICarDetail,
  IStoreItems,
  IStoreItemsValue,
  ITableHeader,
} from "@/helpers/interfaces";
import { computed, reactive, Ref, ref } from "@vue/composition-api";
import Vue from "vue";
import {
  _header,
  _items,
  _defaultStoreItems,
  getDefaultId,
  _defaultItems,
  _excelHeader,
} from "../helpers";

export default Vue.extend({
  name: "HelloWorld",
  setup() {
    const items: Ref<ICarDetail[]> = ref(_items);
    const fields: ITableHeader[] = _header;
    const storeItems: IStoreItems = reactive(_defaultStoreItems);
    /**
     * @return function
     * @param item
     */
    const calculateCost = computed(
      () => (item: ICarDetail) => {
        item.cost = item.price * item.amount
        return item.cost;
      }
    );
    /**
     * @param {id, tableIndex}
     */
    const addRow = (id: ICarDetail["id"], tableIndex: number) => {
      // calculate store id to push array
      const storeId = `${id}.${getDefaultId(storeItems, id)}`;
      // add to array with splice because it should stick order
      items.value.splice(storeItems[id].index + tableIndex + 1, 0, {
        ..._defaultItems,
        id: storeId,
      });
      // store id to get info about row
      storeItems[storeId] = {
        parent_id: id,
        index: 0,
        children_count: 0,
      };
      // increment index for new row addition
      storeItems[id].index++;
      const recursiveSearch = (id: IStoreItemsValue["parent_id"]): void => {
        if (!id || !storeItems[id]) return;
        storeItems[id].index++;
        recursiveSearch(storeItems[id].parent_id);
      };
      const { parent_id } = storeItems[id];
      recursiveSearch(parent_id);
      storeItems[id].children_count++;
    };
    /**
     * insert for every child price
     */
    const depthInsert = (targetId: IStoreItemsValue["parent_id"]) => {
      const currentItem = items.value.find((item) => item.id === targetId);
      if (!currentItem || !targetId) return;
      currentItem.price = 0;

      const keys = Object.keys(storeItems);
      for (const key of keys) {
        if (storeItems[key].parent_id === targetId) {
          const curItem = items.value.find((item) => item.id == key);
          if (curItem) {
            currentItem.price += +curItem.price;
          }
        }
      }
      if (storeItems[currentItem.id])
        depthInsert(storeItems[currentItem.id].parent_id);
    };
    /**
     * @param: {parent_id, targetIndex}
     */
    const removeIndexes = (
      parentId: IStoreItemsValue["parent_id"],
      targetIndex: IStoreItemsValue["index"]
    ) => {
      if (!parentId) return;
      storeItems[parentId].index -= targetIndex + 1;

      removeIndexes(storeItems[parentId].parent_id, targetIndex);
    };
    /**
     * @param id: target id to should be removed
     * @param tableIndex: index of items array
     */
    const removeRow = (id: ICarDetail["id"], tableIndex: number): void => {
      const removeChildren = (id: ICarDetail["id"]) => {
        const keys = Object.keys(storeItems);
        for (const key of keys) {
          if (!storeItems[key]) continue;
          if (storeItems[key].parent_id == id) {
            // delete from store
            delete storeItems[key];
            // delete from array
            items.value = items.value.filter((item) => item.id != key);
            // call function till remove all children
            removeChildren(key);
          }
        }
      };
      const { parent_id } = storeItems[id];
      // remove every parent indexes which needs for addition
      removeIndexes(parent_id, storeItems[id].index);
      // remove children if it has children
      removeChildren(id);
      // remove itself
      delete storeItems[id];
      items.value.splice(tableIndex, 1);
      // depth insert for parent items when their children changed
      depthInsert(parent_id);
    };
    /**
     * @returns true item children exist
     */
    const isChildrenExist = (item: ICarDetail) => {
      const findItem = Object.keys(storeItems).find(
        (key) => storeItems[key].parent_id === item.id
      );
      return findItem;
    };
    /**
     * onPriceChange
     */
    const onNumbersChange = (value: string, item: ICarDetail) => {
      if (isNaN(+value)) return;
      depthInsert(storeItems[item.id].parent_id);
    };
    return {
      items,
      fields,
      addRow,
      removeRow,
      onNumbersChange,
      isChildrenExist,
      calculateCost,
      _excelHeader,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
