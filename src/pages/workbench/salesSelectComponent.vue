<template>
  <q-dialog
    position="bottom"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="showSales"
    :transition-duration="200"
    @update:model-value="changeModal"
  >
    <q-card dark style="width: 80vw;height: 60vh">
      <q-card-section class="row">
        <div class="text-h6">选择导购员</div>
        <q-space/>
        <q-btn size="sm" flat round icon="close" v-close-popup/>
      </q-card-section>
      <q-separator color="grey-10"/>
      <q-card-section>
        <q-list dark>
          <q-item tag="label" v-for="(item,index) in sales" :key="index"
                  @click="selected(item.id)"
                  class="q-mb-xs"
                  :class="{'bg-grey-7':item.id===salesId}">
            <q-item-section avatar>
              <q-img :src="item.head_url"/>
            </q-item-section>
            <q-item-section class="card-bg">
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption>{{ item.mobile }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: "salesSelectComponent",
  props: ['showSales', 'salesId', 'sales'],
  emits: ['update:showSales', 'update:salesId'],
  methods: {
    changeModal(v) {
      this.$emit('update:showSales', v)
    },
    selected(v) {
      this.$emit('update:salesId', v)
      this.changeModal(false)
    }
  }
}
</script>

<style scoped>

</style>
