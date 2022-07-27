export function putGoods(context, goodsList) {
  context.commit('cart/put', goodsList)
}

export function delGoods(context, id) {
  context.commit('cart/del',id)
}
export function clear(context) {
  context.commit('cart/clear')
}
