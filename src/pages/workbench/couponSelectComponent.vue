<template>
  <q-dialog
    :model-value="dialog"
    @update:model-value="update"
    persistent
    position="bottom"
    transition-show="slide-up"
    transition-hide="slide-down"
    autofocus
    ref="couponDialog"
  >
    <q-card dark style="width: 80vw;height: 60vh">
      <q-card-section class="row">
        <div class="text-h6">选择优惠券</div>
        <q-space/>
        <q-btn size="sm" flat round icon="close" v-close-popup/>
      </q-card-section>
      <q-separator color="grey-10"/>
      <q-card-section>
        <q-scroll-area style="height: calc(60vh - 157px)">
          <q-list dark>
            <q-item tag="label" v-for="(item,index) in couponList" :key="index"
                    class="coupon-item q-pa-none q-mb-xs bg-grey-9"

                    :class="{'selected':isSelected(item.id)}">
              <q-item-section side class="items-center card-bg">
                <q-item-label class="text-h5">{{
                    item.type === 1 ? `${item.coupon_data.discount}折` : `￥${item.discount}`
                  }}
                </q-item-label>
                <q-item-label caption>满{{ item.coupon_min_price }}可用</q-item-label>
              </q-item-section>
              <q-item-section class="q-pa-sm">
                <q-item-label>{{ item.coupon_data.name }}</q-item-label>
                <q-item-label caption>
                  {{ item.start_time }} - {{ item.end_time }}
                </q-item-label>
                <q-item-label overline>
                  <div v-if="item.coupon_data.appoint_type == 3">全场通用</div>
                  <div v-else-if="item.coupon_data.appoint_type == 4">仅限当面付活动使用</div>
                  <div v-else-if="item.coupon_data.appoint_type == 5">仅限礼品卡使用</div>
                  <div v-else>限品类</div>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon class="q-mr-sm" size="xs" name="check" v-if="isSelected(item.id)"/>
                <input class="hidden" type="radio" name="id" v-model="selected" :value="item.id"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>
      <q-splitter dark/>
      <q-card-actions>
        <q-space/>
        <q-btn @click="selectCoupon" color="positive" label="确定"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "couponSelectComponent",
  props: ['dialog', 'couponList', 'userCouponId'],
  emits: ['update:dialog', 'update:select'],
  data() {
    return {
      selected: 0
    }
  },
  methods: {
    isSelected(id) {
      if (this.selected === 0 && this.userCouponId) {
        return this.userCouponId === id
      } else {
        return this.selected === id
      }
    },
    update(v) {
      this.$emit('update:dialog', v)
    },
    selectCoupon() {
      this.$refs.couponDialog.hide()
      if (this.selected !== this.userCouponId) {
        this.$emit('update:select', this.selected)
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.card-bg {
  background-color: #77623b;
  width: 160px;
  padding-right: 0;
}

.coupon-item {
  border: 1px solid transparent;

  &.selected {
    border: 1px solid #a5a5a5;

    ::v-deep(.q-icon) {
      color: #b4914f;
    }
  }
}

</style>
