<template>
    <div class="footer-main">
      <div class="main-copyright row">Copyright © 2019-{{(new Date).getFullYear()}} 孙启萌 版权所有</div>
      <div class="main-record row" @click="go">鄂ICP备19018246号-1</div>
    </div>
</template>

<script>
export default{
  name: 'Footer',
  mounted() {},
  methods: {
    go() {
      window.open('https://beian.miit.gov.cn');
    }
  }
}
</script>

<style lang="less" scoped>
.footer-main{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  &::before{
	  position: absolute;
	  top: 0;
	  content: '';
	  display: block;
	  border: 1px;
	  width: 100%;
    background: #3333;
	  height: 1px;
  }
  .main-copyright{
    cursor: default;
  }
  .main-record{
    cursor: pointer;
  }
}
.row{
  color: #333;
  margin: 3px 20px;
}
</style>