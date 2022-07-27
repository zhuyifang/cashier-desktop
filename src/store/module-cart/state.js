import {LocalStorage} from "quasar";

export default function () {
  return LocalStorage.getItem('cart') || {
    list: [],
    address_id: null,
    sales_id:null,
    user_id:null,
    add_money:null,
    change_price_type:null,
    change_price:null,
    payment_type:null,
    time:null
  }
}
