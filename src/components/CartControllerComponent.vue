<template>
  <div>
    <q-input
      dark
      ref="quantity"
      bottom-slots
      class="cart-controller bg-transparent"
      :model-value="value"
      @update:model-value="inputHandle"
      borderless
      hide-bottom-space
      maxlength="12"
      dense>
      <template v-slot:prepend>
        <q-btn color="blue" @click.stop="less" size="xs" outline round dense icon="remove"/>
      </template>

      <template v-slot:append>
        <q-btn color="blue" @click.stop="add" size="xs" outline round dense icon="add"/>
      </template>
    </q-input>

  </div>
</template>

<script>

export default {
  name: "CartControllerComponent",
  props: ['value','min'],
  emits: ['remove','update:value'],
  methods:{
    inputHandle(e){
      this.$emit("update:value", e*1)
    },
    add(){
      this.$emit("update:value", this.value + this.min)
    },
    less(){
      this.$emit("update:value", this.value - this.min)
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-controller {

  ::v-deep(.q-field__control) {
    background: transparent;
  }

  ::v-deep(.q-field__native) {
    text-align: center;
  }
}
</style>
