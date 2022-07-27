import {boot} from 'quasar/wrappers'
import Dexie from 'dexie';

const db = new Dexie('myDatabase');

db.version(2).stores({
  goods: 'id',
  goodsAttr:'id,baseId,name,bar_code'
})

export default boot(({app}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$db = db
})

export {db}



