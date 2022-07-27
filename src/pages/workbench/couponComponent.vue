<template>

  <q-list dense dark>
    <template v-if="member">
      <q-item clickable class="text-grey-7">
        <q-item-section side>
          <q-icon color="grey-8" name="face"/>
        </q-item-section>
        <q-item-section>会员优惠</q-item-section>
        <q-item-section side class="text-grey-5">
          -￥0
        </q-item-section>
        <q-item-section side>
          <q-icon class="invisible" name="chevron_right"/>
        </q-item-section>
      </q-item>
      <q-item clickable class="text-grey-7">
        <q-item-section side>
          <q-icon color="grey-8" name="local_atm"/>
        </q-item-section>
        <q-item-section>积分抵扣</q-item-section>
        <q-item-section side class="text-grey-5">
          {{ integral }}
        </q-item-section>
        <q-item-section side>
          <q-toggle
            color="green"
            :disable="!canUseIntegral"
            :true-value="1"
            :false-value="0"
            :model-value="useIntegral"
            @update:model-value="changIntegral"
            size="xs"/>
        </q-item-section>
      </q-item>
      <q-item clickable class="text-grey-7" @click="couponDialog=true">
        <q-item-section side>
          <q-icon color="grey-8" name="card_giftcard"/>
        </q-item-section>
        <q-item-section>{{ couponName }}</q-item-section>
        <q-item-section side>
          {{ couponPrice }}
        </q-item-section>
        <q-item-section side>
          <q-icon color="grey-8" name="chevron_right"/>
        </q-item-section>
      </q-item>
    </template>
    <template v-else>
      <div class="none-member">未选择会员,无法享受优惠</div>
    </template>
    <q-separator color="grey-10"/>
    <q-item clickable class="text-grey-7">
      <q-item-section side>
        <q-icon color="grey-8" name="card_membership"/>
      </q-item-section>
      <q-item-section>整单优惠</q-item-section>
      <q-item-section side class="text-grey-5">
        -￥{{ fullReduceDiscount }}
      </q-item-section>
      <q-item-section side>
        <q-icon color="grey-8" class="invisible" name="chevron_right"/>
      </q-item-section>
    </q-item>
  </q-list>
  <coupon-select-component :userCouponId="userCouponId" v-model:dialog="couponDialog" :couponList="couponList"
                           @update:select="selectCoupon"/>
</template>

<script>
import CouponSelectComponent from "pages/workbench/couponSelectComponent.vue";

export default {
  name: "couponComponent",
  components: {CouponSelectComponent},
  props: ['member', 'orderPreview', 'useIntegral', 'userCouponId', 'couponList'],
  emits: ['update:useIntegral', 'update:userCouponId'],
  computed: {
    canUseIntegral() {
      if (this.orderPreview === null) {
        return false
      }
      if (this.orderPreview.mch_list.length === 0) {
        return false
      }
      return this.orderPreview.mch_list[0].integral.can_use
    },
    integral() {
      if (this.orderPreview === null) {
        return '-'
      }
      if (this.orderPreview.mch_list.length === 0) {
        return '-'
      }
      if (this.orderPreview.mch_list[0].integral.can_use) {
        return '-￥' + this.orderPreview.mch_list[0].integral.deduction_price
      }
      return '-'
    },
    couponName() {
      if (this.userCouponId && this.couponList.length > 0) {
        let coupon = this.couponList.find((item) => {
          return item.id === this.userCouponId
        })
        return coupon ? coupon.coupon_data.name : '优惠券'
      } else {
        return '优惠券';
      }
    },
    couponPrice() {
      if (this.userCouponId && this.couponList.length > 0) {
        let coupon = this.couponList.find((item) => {
          return item.id === this.userCouponId
        })
        if (!coupon) {
          return '-'
        }
        return coupon.type === 1 ? `${coupon.coupon_data.discount}折` : `￥${coupon.discount}`

      } else {
        return '-';
      }
    },
    fullReduceDiscount() {
      return this.orderPreview === null ? 0 : this.orderPreview.mch_list.length > 0 ? this.orderPreview.mch_list[0].full_reduce_discount : 0
    }
  },
  data() {
    return {
      couponDialog: false
    }
  },
  methods: {
    changIntegral(v) {
      console.log(v)
      this.$emit('update:useIntegral', v)
    },
    selectCoupon(v) {
      console.log('selectCoupon', v)
      this.$emit('update:userCouponId', v)
    }
  }
}
</script>

<style scoped>
.none-member {
  height: 98px;
  text-align: center;
  line-height: 90px;
  color: #9e9e9e;
}
</style>
