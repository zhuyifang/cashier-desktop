<template>
  <div class="q-pa-xs">
    <div v-if="member!==null" class="row flex-center" style="padding: 13.5px 10px;">
      <div class="col" style="flex: 50px">
        <q-avatar size="38px"><img
          :src="avatar"/>
        </q-avatar>
      </div>
      <div class="col">
        <div>{{ member.nickname }}</div>
        <div class="text-grey-7">
          <div class="row q-col-gutter-xs text-caption">
            <div class="col-3">积分</div>
            <div class="col-3 text-weight-bold text-orange text-right">{{ member.integral }}</div>
            <div class="col-3">余额</div>
            <div class="col-3 text-weight-bold text-orange text-right">{{ member.balance }}</div>
          </div>
        </div>
      </div>
      <div class="col text-right" style="flex: 30px">
        <q-btn flat round @click="changeMember(null)" size="xs" icon="clear"/>
      </div>
    </div>
    <div v-else>
      <q-input
        ref="memberInput"
        dark
        dense
        outlined
        placeholder="请输入收款码/会员手机号"
        style="padding: 14px 10px"
        v-model="memberKeyword"
        @keydown.enter="searchMember"
        class="full-width"/>
    </div>
  </div>
  <q-separator color="grey-10"/>
  <coupon-component
    :couponList="couponList"
    :useIntegral="useIntegral"
    @update:useIntegral="$emit('update:useIntegral',$event)"
    :userCouponId="userCouponId"
    @update:userCouponId="$emit('update:userCouponId',$event)"
    :member="member"
    :orderPreview="orderPreview"/>

</template>

<script>


import CouponComponent from "pages/workbench/couponComponent.vue";
import api from "src/api/api";

export default {
  name: "memberComponent",
  components: {CouponComponent},
  props: ['member', 'orderPreview', 'useIntegral', 'userCouponId','couponList'],
  emits: ['update:member','update:useIntegral','update:userCouponId','updateCoupon'],
  data() {
    return {
      memberKeyword: ''
    }
  },
  computed: {
    avatar() {
      let defaultAvatar = new URL('../../assets/default_img_new.png', import.meta.url).href
      return this.member ? this.member.avatar || defaultAvatar : defaultAvatar
    },
  },
  watch:{
    useIntegral(){
      this.$emit('updateCoupon')
    },
    userCouponId(){
      this.$emit('updateCoupon')
    }
  },
  methods: {
    changeMember(obj = null) {
      this.$emit('update:member', obj)
      this.$emit('updateCoupon')
      this.memberKeyword = ''
      if (obj === null) {
        this.$nextTick(() => {
          this.$refs.memberInput.focus()
        })
      }
    },
    async searchMember() {
      console.log('searchMember', this.memberKeyword)
      let res = await api.memberList(this.$store.state.mall.id, this.memberKeyword)
      if (res.code === 0) {
        this.changeMember(res.data.list[0])
        return
      }
      throw new Error(res.msg)
    }
  }
}
</script>

<style scoped>

</style>
