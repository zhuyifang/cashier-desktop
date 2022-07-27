import urls from './urls.json'
import {formHttp, http} from 'boot/axios'
import base64 from "base-64";
import {LocalStorage} from "quasar";

class Api {
  constructor() {
  }

  async getCsrf() {
    let {data} = await http.get(urls.csrf)
    return data
  }

  async login({mallId, username, password, captcha}) {
    let url, submitData
    if (mallId) {
      url = urls.login.teller
      submitData = {
        'mall_id': mallId,
        'username': username,
        'password': password,
        'pic_captcha': captcha
      }

    } else {
      url = urls.login.admin
      submitData = {
        'mall_id': mallId,
        'user_type': 1,
        'form': {
          'username': username,
          'password': password,
          'checked': false,
          'pic_captcha': captcha
        },
      }
    }
    let {data} = await formHttp.post(url, submitData)
    return data
  }

  async mallList() {
    let {data} = await http.get(urls.mall.list)
    return data
  }

  async mallSetting(mallId) {
    let {data} = await http.get(urls.mall.setting, {params: {_mall_id: mallId || LocalStorage.getItem('mall').id}})
    return data
  }

  async mallSales(mallId) {
    let {data} = await http.get(urls.mall.sales, {params: {_mall_id: mallId || LocalStorage.getItem('mall').id}})
    return data
  }

  async goodsList(mallId, type, limit = 50, page = 1) {
    let {data} = await http.get(urls.goods.list, {
      params: {
        _mall_id: mallId,
        limit: limit,
        type: type === 'all' ? 1 : 0,
        page: page
      }
    })
    return data
  }

  async goodsDetail(mallId, goodsId) {
    let {data} = await http.get(urls.goods.detail, {
      params: {
        _mall_id: mallId,
        goods_id: goodsId
      }
    })
    return data
  }

  async memberList(mallId, keyword) {
    let {data} = await http.get(urls.member.index, {
      params: {
        _mall_id: 1,
        keyword
      }
    })
    return data
  }


  async orderPreview(formData) {
    let {data} = await formHttp.post(urls.order.preview + '&_mall_id=' + LocalStorage.getItem('mall').id, {form_data: JSON.stringify(formData)})
    return data
  }

  async orderCoupon(formData) {
    let {data} = await formHttp.post(urls.order.coupon + '&_mall_id=' + LocalStorage.getItem('mall').id, {
      form_data: JSON.stringify(formData),
      is_cant_use_list: 0
    })
    return data
  }

  async orderSubmit(formData) {
    let {data} = await formHttp.post(urls.order.submit + '&_mall_id=' + LocalStorage.getItem('mall').id, {
      form_data: JSON.stringify(formData),
      is_cant_use_list: 0
    })
    return data
  }

  async orderPayStatus(formData) {
    let {data} = await formHttp.post(urls.order.payStatus + '&_mall_id=' + LocalStorage.getItem('mall').id, formData)
    return data
  }

}

export default new Api()
