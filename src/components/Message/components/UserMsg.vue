<template>
  <div class="user-msg">
    <div class="msg-list">
      <div
        v-for="(item, index) in userList"
        :key="index"
        class="list-item"
        :class="chooseIndex === index ? 'item-choose' : '' "
        @click="chooseItem(item, index)"
      >
        <div class="item-img">
          {{ item.img }}
        </div>
        <div class="item-content">
          <div class="title">
            <div class="title-name">
              {{ item.name }}
            </div>
            <div class="title-time">
              {{ item.time }}
            </div>
          </div>
          <div class="info">
            <div class="info-content">
              {{ item.content }}
            </div>
            <div class="info-num">
              {{ item.num }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="msg-main">
      <div class="main-content" />
      <div class="main-input" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userList: [
        { img: 'url', name: 'test', time: '2021-10-23', content: 'test', num: 5, userId: 10000 },
        { img: 'url', name: 'test', time: '2021-10-23', content: 'test', num: 5, userId: 10000 },
        { img: 'url', name: 'test', time: '2021-10-23', content: 'test', num: 5, userId: 10000 },
        { img: 'url', name: 'test', time: '2021-10-23', content: 'test', num: 5, userId: 10000 },
        { img: 'url', name: 'test', time: '2021-10-23', content: 'test', num: 5, userId: 10000 },
        { img: 'url', name: 'test', time: '2021-10-23', content: 'test', num: 5, userId: 10000 },
        { img: 'url', name: 'test', time: '2021-10-23', content: 'test', num: 5, userId: 10000 },
        { img: 'url', name: 'test', time: '2021-10-23', content: 'test', num: 5, userId: 10000 },
        { img: 'url', name: 'test', time: '2021-10-23', content: 'test', num: 5, userId: 10000 },
        { img: 'url', name: 'test', time: '2021-10-23', content: 'test', num: 5, userId: 10000 },
        { img: 'url', name: 'test', time: '2021-10-23', content: 'test', num: 5, userId: 10000 }
      ],
      chooseIndex: ''
    }
  },
  methods: {
    chooseItem (item, index) {
      this.chooseIndex = index
    }
  }
}
</script>

<style lang="less" scoped>
.user-msg{
    display: flex;
    height: 100%;
    .msg-list{
        overflow-x: hidden;
        overflow-y: auto;
        flex: 1;
        .list-item{
            display: flex;
            align-items: center;
            padding: 10px;
            position: relative;
            &:hover{
                background: #9b95c933;
            }
            .item-img{
                height: 30px;
                width: 30px;
                border-radius: 30px;
                text-align: center;
                line-height: 30px;
                background: rgba(0, 0, 0, 0.3);
                margin-right: 5px;
            }
            .item-content{
                flex: 1;
                .title{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .info{
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
        .item-choose{
            background: #9b95c988;
            &:hover{
                background: #9b95c988;
            }
        }
    }
    .msg-main{
        overflow: auto;
        flex: 4;
        .main-content{
            height: 70%;
        }
        .main-input{
            height: 30%;
        }
    }
}
</style>
