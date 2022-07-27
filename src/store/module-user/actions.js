
export function login(context, {id, name}) {
  context.commit('user/login', {id, name})
}
export function logout(context, {id, name}) {
  context.commit('user/logout')
}
