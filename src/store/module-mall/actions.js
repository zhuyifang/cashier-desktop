export function updateAction(context, {id, name, setting}) {
  context.commit('mall/updateMutation', {id, name, setting})
}
