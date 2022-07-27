const axios = require('axios')
const fs = require('fs')
const path = require('path')
let goods = []
getData()

async function getData(pageNum = 1) {
  let {data} = await axios.get('http://api.wulianbianli.com/micro-shop/data/sync', {
    type: 'pull',
    timeout: false
  }, {
    headers: {
      "Authorization": "bearer 82769e2d-1904-4911-b8a8-04713dda8636"
    }
  })
  if (data.code !== 200) {
    throw new Error(data.message)
  }
  let {pageData, pages} = data.data
  goods = goods.concat(pageData)
  if (pageNum !== pages) {
    await getData(pageNum + 1)
  } else {
    console.log('success')
    fs.writeFileSync(path.resolve(__dirname,'./goods.json'),JSON.stringify(goods))
  }
}
