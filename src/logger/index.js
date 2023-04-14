// 控制台输出相关
export default (function () {
  /* 自定义输出可能造成错误不好定位 暂时弃用 */
  // // 自定义日志方法
  // var _privateLog = console.log;
  // console.log = function (message) {
  //     // 如果只有一个参数，且这个参数是字符串，则为它添加样式
  //     if(typeof arguments[0] === 'string' && arguments.length === 1) {
  //         arguments[0] = '%c %c' + arguments[0]
  //         // GitHub Badges
  //         arguments[1] = 'color: #4e72b8;background-image: url(https://img.shields.io/badge/LS-%E6%97%A5%E5%BF%97-brightgreen?style=plastic); padding: 3px 25px; margin: 0px 8px 0px 0px; background-size: contain; background-repeat: no-repeat;'
  //         arguments[2] = 'color: #F56C6C; font-weight: bold'
  //         arguments.length = 3
  //     }
  //     _privateLog.apply(console, arguments);
  // };
})()
