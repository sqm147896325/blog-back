<template>
  <el-dialog
    title="消息控制台"
    width="80%"
    top="5vh"
    :close-on-click-modal="false"
    v-bind="$attrs"
  >
    <div class="message-content">
      <el-tabs :stretch="true">
        <el-tab-pane>
          <template #label>
            <el-icon>
              <User />
            </el-icon>
            <span>用户</span>
          </template>
          <UserMsg />
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <el-icon>
              <Bell />
            </el-icon>
            <span>通知</span>
          </template>
          <NoticeMsg />
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <el-icon>
              <Connection />
            </el-icon>
            <span>聊天室</span>
          </template>
          <RoomMsg />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
import UserMsg from './components/UserMsg.vue'
import NoticeMsg from './components/NoticeMsg.vue'
import RoomMsg from './components/RoomMsg.vue'
export default {
  name: 'MessageCom',
  components: { UserMsg, NoticeMsg, RoomMsg },
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.message-content{
    height: 80vh;
    position: relative;
}
::v-deep(.el-dialog__body) {
    padding: 0px 10px;
}
::v-deep(.el-tab-pane) {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
::v-deep(.el-tabs__content) {
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    top: 40px;
    bottom: 0;
}
</style>
