import {LocalStorage} from "quasar";

export function login(state, {id, nickname, mobile, accessToken}) {
  Object.assign(state, {id, nickname, mobile, accessToken})
  LocalStorage.set('user', state)
}

export function logout(state) {
  Object.keys(state).forEach((k) => {
    delete state[k]
  })
  LocalStorage.remove('user')
}
