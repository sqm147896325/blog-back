import { Notification } from 'element-ui'
// import { Message } from 'element-ui'
import msgDetail from '@/components/MsgTip/msgDetail.vue';
import Vue from 'vue'
const  vm = new Vue
const h = vm.$createElement;
 
export default function msgTip(type, res, duration = 15000) {
    Notification({
        type,
        message: h(msgDetail, {
            props: {
                title: res.msg,
                msgMap: res.msgMap,
                dataInfo: res.dataInfo,
            },
        }),
        duration,
        position: 'bottom-right'
    })
}
