import {LocalStorage} from "quasar";

export default function () {
  return LocalStorage.getItem('user') || {
    id: null,
    nickname: null,
    mobile:null,
    accessToken:null
  }
}
