import { ElNotification } from 'element-plus'
import msgDetail from '@/components/MsgTip/msgDetail.vue'
import { h } from 'vue'

export default function msgTip (type, res = {}, duration = 15000) {
  ElNotification({
    type,
    message: h(msgDetail, {
      title: res.msg || '',
      msgMap: res.msgMap || {},
      dataInfo: res.dataInfo || {}
    }),
    duration,
    position: 'bottom-right'
  })
}
