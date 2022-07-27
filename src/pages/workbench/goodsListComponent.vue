<template>
  <q-table
    dark
    class="goods-list"
    selection="single"
    hide-pagination
    hide-selected-banner
    hide-bottom
    :selected="selected"
    @selection="selection"
    :rows="goodsList"
    :columns="columns"
    row-key="id"
    :pagination="{
      rowsPerPage:0
    }"
  >
    <template v-slot:body="props">
      <q-tr :props="props" @click.stop="props.selected = !props.selected">
        <q-td key="name" style="width:60%;overflow: hidden" :props="props">
          <q-list dense style="width: 100%">
            <q-item class="q-mb-sm">
              <q-item-section avatar>
                <q-avatar>
                  <img
                    :src="props.row.cover_pic">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label :lines="2">{{ props.row.baseName }}</q-item-label>
                <q-item-label class="text-grey-7" caption lines="1">{{ props.row.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-td>
        <q-td key="price" :props="props">
          <q-badge>￥{{ props.row.price }}</q-badge>
        </q-td>
        <q-td key="quantity" :props="props">
          <CartControllerComponent
            :min="props.row.min_number"
            v-model:value="props.row.num"
            @update:value="updateValue(props.row.goods_attr_id,$event)"
          />
        </q-td>
        <q-td class="justify-end" key="other" :props="props">
          <q-btn round @click="updateValue(props.row.goods_attr_id,0)" class="float-right" size="xs" flat icon="close"/>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import CartControllerComponent from "components/CartControllerComponent.vue";

const columns = [
  {name: 'id', field: 'id', align: 'left'},
  {name: 'cover_pic', field: 'cover_pic', align: 'left',},
  {
    name: 'name',
    align: 'left',
    field: 'name'
  },
  {name: 'quantity', align: 'center', field: 'quantity', style: "width:130px"},
  {name: 'price', field: 'price', style: "width:120px"},
  {name: 'min_number', field: 'min_number'},
  {name: 'other', style: "width:60px"}
]
export default {
  name: "goodsListComponent",
  components: {CartControllerComponent},
  props: ['selected', 'goodsList'],
  emits: ['update:selected', 'update:goodsList', 'update:remove'],
  setup() {
    return {columns}
  },
  methods: {
    selection(v) {
      this.$emit('update:selected', v.rows)
    },
    updateValue(id,value) {
      if (value === 0) {
          this.$emit('update:remove', id)
      }
      setTimeout(()=>{
        this.$emit('update', id)
      },0)

    }
  }
}
</script>

<style lang="scss" scoped>
.goods-list {
  ::v-deep(.q-table) {
    table-layout: fixed

  }
}
</style>
