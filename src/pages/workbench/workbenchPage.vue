<template>
  <q-page class="workbench q-pa-md">
    <div class="row q-col-gutter-md q-col-gutter-md">
      <div class="col">
        <q-card dark flat class=" my-card">
          <q-card-section>
            <div style="height: 45px" class="row flex-center justify-center">
              <div class="col-6 relative-position">
                <q-input dark outlined dense
                         autofocus
                         ref="keywords"
                         style="width:auto"
                         placeholder="请输入条码"
                         @keydown.enter="searchGoods"
                         @keydown.down.stop="nextSearchGoods"
                         @keydown.up.stop="prevSearchGoods"
                         v-model="keyword">
                  <template v-slot:append>
                    <q-icon v-if="keyword === ''" name="search" @click="searchGoods"/>
                    <q-icon v-else name="clear" class="cursor-pointer" @click="keyword = ''"/>
                  </template>
                </q-input>
                <q-virtual-scroll bordered separator dark class="more-goods shadow-4"
                                  ref="virtualListRef"
                                  component="q-list"
                                  virtual-scroll-slice-size="12"
                                  virtual-scroll-slice-ratio-after="0.4"
                                  :items="search.goods"
                                  v-if="search.goods.length>1">
                  <template v-slot="{ item, index }">
                    <q-item clickable
                            active-class="bg-positive text-white"
                            @click.stop="selectSearchGoods(index)"
                            :active="index===search.active"
                            :key="index">
                      <q-item-section avatar>
                        <q-avatar>
                          <img :src="item.cover_pic">
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ item.baseName }}</q-item-label>
                        <q-item-label caption lines="1">{{ item.name }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>{{ item.price }}</q-item-section>
                    </q-item>
                  </template>
                </q-virtual-scroll>
              </div>
              <div class="col-3 q-pl-lg text-subtitle1">
                <span class="q-ml-md">共1个商品</span>
              </div>
              <div class="col-3 text-right">
                <q-btn color="positive" outline class="btn-fixed-width" round dense icon="delete_outline">
                  <template v-slot:loading>
                    <q-spinner-gears/>
                  </template>
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-separator/>
          <goods-list-component @update="updateCoupon" @update:remove="removeCart"
                                :goods-list="order.list[0].goods_list"
                                v-model:selected="orderGoodsSelected"/>
        </q-card>
      </div>
      <div class="col" style="flex: 300px">
        <q-card dark flat class="my-card">
          <member-component
            @updateCoupon="updateCoupon"
            v-model:use-integral="order.list[0].use_integral"
            v-model:user-coupon-id="order.list[0].user_coupon_id"
            :orderPreview="orderPreview"
            :couponList="couponList"
            v-model:member="member"/>
          <q-separator color="grey-10"/>
          <q-item clickable @click="showSales=true" class="text-grey-7">
            <q-item-section side>
              <q-icon color="grey-8" name="support_agent"/>
            </q-item-section>
            <q-item-section>导购员</q-item-section>
            <q-item-section side class="text-grey-5">
              {{ saleName }}
            </q-item-section>
            <q-item-section side>
              <q-icon color="grey-8" name="chevron_right"/>
            </q-item-section>
          </q-item>
          <q-separator color="grey-10"/>
          <div class="row flex-center q-my-sm">
            <div class="col-3 text-left q-pl-sm">
              <q-badge color="grey-10" text-color="grey-6">总计</q-badge>
            </div>
            <div class="col-9 text-right q-pr-sm">
              <span class="text-h4 text-grey-5">{{ totalOriginalPrice }}</span>
            </div>
          </div>
          <q-separator color="grey-10"/>
          <div class="row flex-center ">
            <div class="col-3 text-left q-pl-sm">
              <q-badge color="grey-10" text-color="grey-6">优惠</q-badge>
            </div>
            <div class="col-9 text-right q-pr-sm">
              <span class="text-h4 text-weight-thin">{{ totalDiscountsPrice }}</span>
            </div>
          </div>
          <div class="row flex-center q-py-lg">
            <div class="col-3 text-left q-pl-sm">
              <q-badge color="grey-10" text-color="grey-6">应收</q-badge>
            </div>
            <div class="col-9 text-right q-pr-sm">
              <span class="text-h3 text-red-8">{{ totalPrice }}</span>
            </div>
          </div>
          <q-separator/>
          <payment-component :total-price="totalPrice" @submit="submit" v-model:paymentType="form.paymentType"/>

        </q-card>
      </div>
    </div>
  </q-page>
  <sales-select-component :sales="sales" v-model:show-sales="showSales" v-model:sales-id="order.sales_id"/>
</template>

<script>
import {ref} from "vue";
import MemberComponent from "pages/workbench/memberComponent.vue";
import PaymentComponent from "pages/workbench/paymentComponent.vue";
import GoodsListComponent from "pages/workbench/goodsListComponent.vue";
import api from "src/api/api";
import {debounce, throttle} from "quasar";
import SalesSelectComponent from "pages/workbench/salesSelectComponent.vue";

export default {
  name: "workbenchPage",
  components: {SalesSelectComponent, GoodsListComponent, PaymentComponent, MemberComponent},
  setup() {
    return {
      keyword: ref('简装香辣'),
      orderGoodsSelected: ref([]),
      form: ref({
        paymentType: '现金'
      }),
      search: ref({
        goods: [],
        active: null,
        virtualListRef: null
      }),
      member: ref(null),
      couponList: ref([]),
      order: ref({
        list: [{
          mch_id: 0,
          goods_list: [],
          distance: 0,
          remark: '',
          order_form: [],
          use_integral: 0, //是否使用积分
          user_coupon_id: 0 //优惠券ID
        }],
        address_id: null,
        sales_id: '',
        user_id: '',
        add_money: 0,
        change_price_type: 'subtract',
        change_price: '0.00',
        payment_type: 'wechat_scan',
        time: new Date().getTime()
      }),
      orderPreview: ref(null),
      sales: ref([]),
      showSales: ref(false)
    }
  },
  watch: {
    'keyword'(val) {
      if (!val) {
        this.search.goods = []
        this.search.active = null
      }
    },
    'search.active'(val) {
      if (val === null) return;
      this.$refs.virtualListRef.scrollTo(val)
    },
    'member'(v) {
      if (v !== null) {
        this.order.user_id = v.user_id || ''
      } else {
        this.order.user_id = 0
      }
    }
  },
  computed: {
    totalOriginalPrice() {
      return this.orderPreview === null ? 0 : this.orderPreview.mch_list.length > 0 ? this.orderPreview.mch_list[0].total_goods_original_price : 0
    },
    totalDiscountsPrice() {
      //总优惠
      return this.orderPreview === null ? 0 : this.orderPreview.mch_list.length > 0 ? this.orderPreview.mch_list[0].total_discounts_price : 0
    },
    totalPrice() {
      return this.orderPreview === null ? 0 : this.orderPreview.total_price
    },
    saleName() {
      if (this.order.sales_id && this.sales && this.sales.length > 0) {
        let sales = this.sales.find((item) => {
          return item.id === this.order.sales_id
        })
        return sales.name
      } else {
        return '无'
      }
    }
  },
  created() {
    this.updateCoupon = debounce(this.updateCoupon, 300)
    this.mallSales()
  },
  methods: {
    /**
     * 候选商品的选择操作
     */
    prevSearchGoods() {
      if (this.search.goods.length === 0) {
        return;
      }
      if (this.search.active === null) {
        this.search.active = 0
        return
      }
      if (this.search.active !== 0) {
        this.search.active--
      }
    },
    /**
     * 候选商品的选择操作
     */
    nextSearchGoods() {
      if (this.search.goods.length === 0) {
        return;
      }
      if (this.search.active === null) {
        this.search.active = 0
        return
      }
      if (this.search.active !== this.search.goods.length - 1) {
        this.search.active++
      }
    },
    /**
     * 候选商品的选择操作
     */
    selectSearchGoods(index) {
      this.search.active = index;
      this.searchGoods()
    },
    /**
     * 通过条形码 || 商品名称检索商品
     */
    async searchGoods() {
      if (this.keyword === '') {
        this.$refs.keywords.focus()
        return
      }
      if (this.search.active !== null) {
        this.addCart(this.search.goods[this.search.active])
        return
      }
      let dd = []
      if (isNaN(this.keyword)) {
        dd = await this.$db.goodsAttr.filter((goods) => {
          return (new RegExp(this.keyword, 'g').test(goods.baseName) || new RegExp(this.keyword, 'g').test(goods.name))
        }).toArray()
        console.log(dd)
      } else {
        dd = await this.$db.goodsAttr.where('bar_code').startsWith(this.keyword).toArray()
        console.log(dd)
      }
      switch (dd.length) {
        case 0:
          this.$q.notify({type: 'negative', message: '没有找到该商品', timeout: 1000})
          this.$refs.keywords.select()
          break
        case 1:
          this.addCart(dd[0])
          break
        default:
          this.search.goods = dd
      }
    },
    /**
     * 添加到购物车
     * @param goods
     */
    addCart(goods) {
      goods.num = 1
      let index = this.order.list[0].goods_list.findIndex((item) => {
        return item.goods_attr_id === goods.id
      })
      if (index >= 0) {
        this.order.list[0].goods_list[index].num++
      } else {
        console.log('addCart', goods)
        this.order.list[0].goods_list.unshift({
          "id": goods.baseId,
          "attr": goods.attr,
          "num": goods.num,
          "min_number": goods.min_number,
          "baseName": goods.baseName,
          "name": goods.name,
          "goods_attr_id": goods.id,
          "cart_id": 0,
          "cover_pic": goods.cover_pic,
          "price": goods.price
        })
      }
      this.updateCoupon()
      this.search.active = null
      this.search.goods = []
      this.keyword = ''
    },
    /**
     * 从购物车移除指定商品
     * @param id
     */
    removeCart(id) {
      if (!id) {
        this.order.list[0].goods_list = []
        return
      }
      let index = this.order.list[0].goods_list.findIndex((item) => {
        return item.goods_attr_id === id
      })
      if (index >= 0) {
        this.order.list[0].goods_list.splice(index, 1)
      }
    },
    /**
     * 获取订单优惠
     */
    async updateOrder() {
      let res = await api.orderPreview(this.order)
      if (res.code === 0) {
        this.orderPreview = res.data
      }
      console.log(res)
    },
    async updateCoupon() {
      if (this.member !== null) {
        let data = this.order.list[0]
        data.user_id = this.member.user_id
        let res = await api.orderCoupon(data)
        if (res.code === 0) {
          this.couponList = res.data.list
          if (this.couponList.length > 0) {
            let userCouponId = this.order.list[0].user_coupon_id
            if (userCouponId) { //如果存在优惠券,则检查是否符合使用要求
              let index = this.couponList.findIndex((item) => {
                return item.id === userCouponId
              })
              if (index === -1) {
                this.order.list[0].user_coupon_id = this.findBestCoupon().id
              }
            } else {
              this.order.list[0].user_coupon_id = this.findBestCoupon().id
            }


          }
        }
      }

      await this.updateOrder()
    },
    findBestCoupon() {
      return this.couponList.reduce((a, b) => {
        let aPrice = 0, bPrice = 0
        let total_price = 0
        this.order.list[0].goods_list.forEach((item) => {
          total_price += item.price * item.num
        })
        //打折券
        if (a.type === 1) {
          aPrice = (10 - a.coupon_data.discount) * 0.1 * total_price
        } else {
          aPrice = a.coupon_data.discount
        }

        //固定优惠
        if (b.type === 1) {
          bPrice = (10 - b.coupon_data.discount) * 0.1 * total_price

        } else {
          bPrice = b.coupon_data.discount

        }
        return aPrice > bPrice ? a : b
      })
    },

    async submit() {
      if (!this.order.user_id) {
        this.order.user_id = this.$store.state.mall.setting.user_id
      }
      this.notif = this.$q.notify({
        group: false, // required to be updatable
        timeout: 0, // we want to be in control when it gets dismissed
        spinner: true,
        message: '正在提交订单...'
      })
      let res = await api.orderSubmit(this.order)
      console.log(res)
      if (res.code === 0) {
        this.checkPaymentStatus(res.data.queue_id, res.data.token)
        return this.notif({message:'检查支付状态'})
      }
      this.notif({
        type: 'negative',
        spinner:false,
        icon:'error',
        message:'订单处理失败,原因是:'+res.msg,
        timeout: 1500
      })

    },
    async checkPaymentStatus(queueId, token) {
      let res = await api.orderPayStatus({
        queue_id: queueId,
        token: token,
        user_id: this.order.user_id
      })
      if (res.code !== 0) {
        this.notif({
          type: 'negative',
          spinner:false,
          icon:'error',
          message:'订单处理失败,原因是:'+res.msg,
          timeout: 1500
        })
        return
      }
      if (res.data.id) {
        this.removeCart()
        this.member = null
        this.order.sales_id = ''
        this.notif({
          icon: 'done', // we add an icon
          spinner: false, // we reset the spinner setting so the icon can be displayed
          message: '收银成功!',
          timeout: 1500
        })
        return
      }
      setTimeout(() => {
        this.checkPaymentStatus(queueId, token)
      }, 600)
    },
    async mallSales() {
      let res = await api.mallSales()
      if (res.code !== 0) {
        return this.$q.notify({type: 'negative', message: res.msg})
      }
      this.sales = res.data.list.map((item) => {
        item.label = item.name
        item.value = item.id
        item.img = item.head_url
        return item
      })
      console.log(res)
    },
    activeLine(row) {
      return this.selected.length > 0 ? this.selected[0].row.name === row.name : false
    },
    changeSelect(v) {
      this.selected = [v]
    }
  }
}
</script>

<style lang="scss" scoped>
.workbench {
  .my-card {
    height: calc(100vh - 65px);
  }

  .more-goods {
    position: absolute;
    background: #393939;
    right: 0px;
    left: 0;
    top: 50px;
    z-index: 9999;
    border-radius: 5px;
    max-height: 70vh;
    overflow-y: scroll;
  }

  .goods-list {
    height: calc(100vh - 140px);
    overflow-x: hidden;
    overflow-y: auto;

    ::v-deep(thead) {
      display: none;
    }

    ::v-deep(.selected ) {
      td:before {
        background-color: rgba(255, 255, 255, .1);
      }
    }
  }
}
</style>
