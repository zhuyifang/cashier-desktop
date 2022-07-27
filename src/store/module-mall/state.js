import {LocalStorage} from "quasar";

export default function () {
  return LocalStorage.getItem('mall') || {
    id: null,
    name: null,
    setting: null
  }
}
