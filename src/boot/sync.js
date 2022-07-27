import {boot} from 'quasar/wrappers'
import {db} from './db'
import api from "src/api/api";
import {LocalStorage} from "quasar";

class Sync {


  constructor(mallId) {
    this.mallId = mallId
    this.onProgressCB = (arg) => {
      console.log('log', arg)
    }
    this.total = 0
    this.success = 0
  }


  async start(page = 1) {

    if (!this.mallId) {
      throw new Error('缺少参数 mallId')
    }
    if (page === 1) {
      this.emit({progress: 0})
    }


    let {data} = await api.goodsList(this.mallId, 'all', 1000, page)
    if (data.code === 500) {
      throw new Error('SYNC ERROR:' + data.msg)
    }

    let {pagination, list} = data
    if (!this.total) {
      this.total = pagination.totalCount
    }


    await this.updateData(list)

    if (pagination.current_page < pagination.page_count) {
      await this.start(pagination.current_page++)
    } else {
      this.emit({progress: 100})
      console.log('数据更新完成')
    }
    return this
  }

  async updateData(list) {
    for (let i = 0; i < list.length; i++) {
      await this.updateByOne(list[i].id)
    }
  }

  /**
   * 更新指定商品
   * @param mallId
   * @param goodsId
   * @returns {Promise<void>}
   */
  async updateByOne(goodsId) {
    if (!this.mallId) {
      throw new Error('缺少参数 mallId')
    }
    if (!goodsId) {
      throw new Error('缺少参数:' + goodsId)
    }

    let {data} = await api.goodsDetail(this.mallId, goodsId)
    if (data.code === 500) {
      return console.error('SYNC ERROR', data.msg)
    }
    this.emit({progress: (this.success / this.total).toFixed(2) * 100, name: data.goods.name})

    await db.goods.put(data.goods)

    let goods = []
    data.goods.attr.forEach((item) => {
      goods.push({
        id: item.id,
        baseId: data.goods.id,
        baseName: data.goods.name,
        name: this.attrName(data.goods.attr_groups, item.sign_id),
        attr:this.getAttr(data.goods.attr_groups,item.sign_id),
        bar_code: item.bar_code,
        original_price: data.goods.original_price,
        price: item.price,
        cover_pic: data.goods.cover_pic,
        pic_url: item.pic_url,
        unit: data.goods.unit,
        subtitle: data.goods.subtitle,
        min_number:data.goods.min_number
      })
    })
    console.log(goods)
    await db.goodsAttr.bulkPut(goods)
    this.success++
  }

  getAttr(attrGroup = [], signId = ''){
    signId = signId.split(':')
    let attrs = []
    attrGroup.forEach((group) => {
      group.attr_list.forEach((attr) => {
        if (signId.includes(attr.attr_id.toString())) {
          attrs.push({
            "attr_group_name": group.attr_group_name,
            "attr_group_id": group.attr_group_id,
            "attr_id": attr.attr_id,
            "attr_name": attr.attr_name
          })
        }
      })
    })
    return attrs
  }

  attrName(attrGroup = [], signId = '') {
    signId = signId.split(':')
    let name = ''
    attrGroup.forEach((group) => {
      group.attr_list.forEach((attr) => {
        if (signId.includes(attr.attr_id.toString())) {
          name += attr.attr_name
        }
      })
    })
    return name
  }


  onProcess(cb) {
    this.onProgressCB = cb
    return this
  }

  emit({progress = 0, name = undefined}) {
    typeof this.onProgressCB === 'function' && this.onProgressCB({progress, name})
    return this
  }
}

export default boot(({app}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$sync = Sync
})

export {Sync}



