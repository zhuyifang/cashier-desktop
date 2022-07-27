import {LocalStorage} from "quasar";

export function updateMutation(state, {id, name,setting}) {
  Object.assign(state, {id, name,setting})
  LocalStorage.set('mall', state)
}
