<template>
  <q-tabs
    :model-value="paymentType"
    @update:model-value="updatePaymentType"
    dense
    class="text-grey-8"
    active-class="bg-positive"
    active-color="white"
    indicator-color="white"
    align="justify"
    narrow-indicator
  >
    <q-tab :ripple="false" icon="qr_code_scanner" name="扫码" label="扫码"/>
    <q-tab :ripple="false" icon="local_atm" name="现金" label="现金"/>
    <q-tab :ripple="false" icon="redeem" name="购物卡" label="购物卡"/>
  </q-tabs>
  <q-tab-panels dark keep-alive :model-value="paymentType"
                @update:model-value="updatePaymentType" animated>
    <q-tab-panel dark name="扫码">
      <div class="text-h6">扫码</div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </q-tab-panel>
    <q-tab-panel dark name="现金" class="q-pa-sm">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-3">
          <q-btn class="full-width" outline color="grey-7" label="1"/>
        </div>
        <div class="col-3">
          <q-btn class="full-width" outline color="grey-7" label="2"/>
        </div>
        <div class="col-3">
          <q-btn class="full-width" outline color="grey-7" label="3"/>
        </div>
        <div class="col-3">
          <q-btn class="full-width" outline color="grey-7" icon="backspace"/>
        </div>
      </div>
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-3">
          <q-btn class="full-width" outline color="grey-7" label="4"/>
        </div>
        <div class="col-3">
          <q-btn class="full-width" outline color="grey-7" label="5"/>
        </div>
        <div class="col-3">
          <q-btn class="full-width" outline color="grey-7" label="6"/>
        </div>
        <div class="col-3">
          <q-btn class="full-width" outline color="grey-7" label="挂单"/>
        </div>
      </div>
      <div class="row q-col-gutter-sm">
        <div class="col-9">
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-4">
              <q-btn class="full-width" outline color="grey-7" label="7"/>
            </div>
            <div class="col-4">
              <q-btn class="full-width" outline color="grey-7" label="8"/>
            </div>
            <div class="col-4">
              <q-btn class="full-width" outline color="grey-7" label="9"/>
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-btn class="full-width" outline color="grey-7" label="0"/>
            </div>
            <div class="col-4">
              <q-btn class="full-width" outline color="grey-7" label="."/>
            </div>
            <div class="col-4">
              <q-btn class="full-width" outline color="grey-7" label="00"/>
            </div>
          </div>
        </div>
        <div class="col-3">
          <q-btn class="full-width full-height" color="grey-7" @click="totalPrice>0 &&(showDialog=true)" outline dark
                 label="结账"/>
        </div>
      </div>
    </q-tab-panel>
    <q-tab-panel dark name="购物卡">
      <div class="text-h6">购物卡</div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </q-tab-panel>
  </q-tab-panels>
  <q-dialog v-model="showDialog" :transition-duration="200">
    <q-card dark class="bg-blue-grey-10 q-pa-md" style="width: 30vw">
      <q-card-section class="row text-grey-2">
        <q-badge color="yellow-3" class="text-blue-grey-10" style="width: 20px">找<br/>零</q-badge>
        <q-space/>
        <div class="text-h2 q-pl-sm text-positive">{{ changePrice }}</div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="money"
          input-style="text-align: right;font-size: 64px;line-height:inherit;padding: inherit"
          stack-label dark autofocus
          :placeholder="totalPrice"
          hint="回车,直接结账"
          @keydown.enter="submit"
          label="实收"/>
        <div class="q-gutter-sm q-mt-sm">
          <q-badge class="cursor-pointer" label="10" @click="money=10"/>
          <q-badge class="cursor-pointer" label="20" @click="money=20"/>
          <q-badge class="cursor-pointer" label="50" @click="money=50"/>
          <q-badge class="cursor-pointer" label="100" @click="money=100"/>
          <q-badge class="cursor-pointer" label="200" @click="money=200"/>
          <q-badge class="cursor-pointer" label="500" @click="money=500"/>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn color="positive" @click="submit" class="full-width" label="结账" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "paymentComponent",
  props: ['paymentType', 'totalPrice'],
  emits: ['update:paymentType', 'submit'],
  data() {
    return {
      showDialog: false,
      money: '',
    }
  },
  computed: {
    changePrice() {
      if (this.money) {
        return (this.money - this.totalPrice).toFixed(1)
      }
      return '-'
    }
  },
  methods: {
    updatePaymentType(v) {
      console.log(v)
      this.$emit('update:paymentType', v)
    },
    submit() {
      this.$emit('submit')
    }
  }
}
</script>

<style scoped>

</style>
