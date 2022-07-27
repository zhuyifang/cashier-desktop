import {LocalStorage} from "quasar";


export function put(state, goodsList) {
  let newGoods = []
  state.list.forEach((item)=>{
    item
  })

  Object.assign(state, {list: goodsList})

  LocalStorage.set('cart', state)
}

export function del(state, goodsId) {
  let index = state.list.findIndex((item) => {
    return item.goodsId === goodsId
  })
  if (index >= 0) {
    state.list.splice(0, index)
  }
  LocalStorage.set('cart', state)
}

export function clear(state) {
  Object.keys(state).forEach((k) => {
    delete state[k]
  })
  LocalStorage.remove('cart')
}

