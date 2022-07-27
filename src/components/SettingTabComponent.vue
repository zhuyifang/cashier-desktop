<template>
  <q-tabs
    v-model="tab"
    align="justify"
    narrow-indicator
    class="q-mb-sm text-grey-8"
    active-color="primary"
    indicator-color="primary"
  >
    <q-tab name="base" label="基本设置"/>
    <q-tab name="ticket" label="小票设置"/>
    <q-tab name="monitor" label="客显设置"/>
    <q-tab name="scale" label="电子秤"/>
    <q-tab name="hotKeys" label="快捷键"/>
  </q-tabs>
  <q-tab-panels
    v-model="tab"
    animated
    transition-duration="200"
    transition-prev="slide-down"
    transition-next="slide-up"
  >
    <q-tab-panel class="q-pa-sm" name="base">
      <q-list class="bg-grey-2" separator>
        <q-item>
          <q-item-section>
            <q-item-label>开机启动</q-item-label>
            <q-item-label caption>
              电脑启动时,自动启动软件
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="blue" v-model="config.base.autoStart" val="false"/>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>自动升级</q-item-label>
            <q-item-label caption>
              当有新版本时,自动升级到最新版本
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="blue" v-model="config.base.autoUpdate" val="false"/>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>数据同步</q-item-label>
            <q-item-label caption>
              当本地数据与管理后台不一致时,您可以通过该功能与系统保持一致
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-btn outline color="blue" label="手动同步"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-tab-panel>
    <q-tab-panel name="ticket">
      <q-list class="bg-grey-2" separator>
        <q-item>
          <q-item-section>
            <q-item-label>票据打印机</q-item-label>
            <q-item-label caption>
              请选择销售单据的打印机
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-select dense outlined color="blue" v-model="config.ticket.printer" :options="system.printer"/>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>纸张规格</q-item-label>
            <q-item-label caption>
              请选择打印机所使用的纸张规格
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-select dense outlined color="blue" v-model="config.ticket.paperSize" :options="system.paperSize"/>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>底部空行</q-item-label>
            <q-item-label caption>
              小票底部需要预留多少空白行?
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-select dense outlined color="blue" v-model="config.ticket.endingLine" :options="system.endingLine"/>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list separator class="q-mt-md bg-grey-2">
        <q-item>
          <q-item-section>
            <q-item-label>收银小票</q-item-label>
            <q-item-label caption>
              卖出商品时,打印销售单据
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="blue" v-model="config.ticket.autoPrint.sale" val="false"/>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>退款小票</q-item-label>
            <q-item-label caption>
              退款给顾客时,打印退款单据
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="blue" v-model="config.ticket.autoPrint.refund" val="false"/>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>报损小票</q-item-label>
            <q-item-label caption>
              提交损耗商品时,打印报损单据
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="blue" v-model="config.ticket.autoPrint.damaged" val="false"/>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>入库\出库\调拨小票</q-item-label>
            <q-item-label caption>
              商品入库\出库\调拨时,打印对应单据
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="blue" v-model="config.ticket.autoPrint.inStock" val="false"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-tab-panel>
    <q-tab-panel name="monitor">
      <q-list separator class="bg-grey-2">
        <q-item>
          <q-item-section>
            <q-item-label>客显类型</q-item-label>
            <q-item-label caption>
              请选择向客户展示信息的显示器类型
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-select dense outlined v-model="config.monitor.type" :options="system.monitor.type"/>
          </q-item-section>
        </q-item>
        <template v-if="config.monitor.type==='LED价格显示器'">
          <q-item>
            <q-item-section>
              <q-item-label>客显端口</q-item-label>
              <q-item-label caption>
                请选择向LED客显的通讯端口
              </q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-select dense outlined v-model="config.monitor.port" :options="system.monitor.port"/>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>波特率</q-item-label>
              <q-item-label caption>
                请选择LED客显的通讯波特率
              </q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-select dense outlined v-model="config.monitor.baudRate" :options="system.monitor.baudRate"/>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>LED客显测试</q-item-label>
              <q-item-label caption>
                如果上述设置正确,点击右侧的按钮,客显会显示对应的内容
              </q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-btn-group outline>
                <q-btn outline label="单价"/>
                <q-btn outline label="总价"/>
                <q-btn outline label="收款"/>
                <q-btn outline label="找零"/>
                <q-btn outline label="￥12.34"/>
                <q-btn outline label="清屏"/>
              </q-btn-group>
            </q-item-section>
          </q-item>
        </template>

      </q-list>
    </q-tab-panel>
    <q-tab-panel class="q-pa-sm" name="scale">
      <q-list class="bg-grey-2" separator>
        <q-item>
          <q-item-section>
            <q-item-label>识别自定义的商品条码</q-item-label>
            <q-item-label caption>
              如果需要兼容其他软硬件(如电子秤)生成的条形码,请在此设置
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="blue" v-model="config.scale.on"/>
          </q-item-section>
        </q-item>
        <template v-if="config.scale.on===true">
          <q-item>
            <q-item-section>
              <q-item-label>条码规则</q-item-label>
              <q-item-label caption>
                <p class="q-gutter-xs"><q-badge>A:条码</q-badge><q-badge>B:售价</q-badge><q-badge>C:重量</q-badge><q-badge>D:其他</q-badge></p>
                请使用编写您的规则,例如价格为12.5,则应该输入BB.B
              </q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-input dense outlined />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>扫码测试</q-item-label>
              <q-item-label caption>
                输入规则后,可以在此处进行测试
              </q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-input dense outlined />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-tab-panel>
    <q-tab-panel class="q-pa-sm" name="hotKeys">

    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
export default {
  name: "settingTabComponent",
  emits: ['softConfig'],
  data() {
    return {
      tab: 'base',
      system: {
        printer: [{label: '11', value: '11'}, {label: '22', value: '22'}],
        paperSize: ['58mm', '80mm'],
        endingLine: ['不留空', '1 行', '2 行'],
        monitor: {
          type: ['液晶双屏显示器', 'LED价格显示器'],
          port:['COM1','COM3'],
          baudRate: ['2400', '9600']
        }
      },
      config: {
        base: {
          autoStart: true,
          autoUpdate: true,
        },
        ticket: {
          printer: {label: '11', value: '11'},
          paperSize: '请选择',
          endingLine: '不留空',
          autoPrint: {
            sale: true, //销售
            refund: false, // 退款
            damaged: false, // 报损
            inStock: false // 入库
          }
        },
        monitor: {
          type: '请选择',
          port:'请选择',
          baudRate: '请选择'
        },
        scale: {
          on:false,
          rules:[]
        },
        hotKeys: {}
      }
    }
  },
  watch: {
    config: {
      handle(v) {
        this.$emit('softConfig', v)
      },
      deep: true
    }
  },
  created() {

  }
}
</script>

<style scoped>
.q-tab-panels {
  height: calc(100% - 48px - 8px);
  border-radius: 5px;
  overflow: hidden;
}
</style>
