import { getFirstData, setFirstData } from '@/utils/storage'
import { driver } from 'driver.js'

export default () => {
  const firstData = getFirstData()
  if (firstData.enterSys !== true) {
    return false
  }
  const menuEls = document.querySelectorAll('[id^="level-0"]')
  const menuSteps = []
  menuEls.forEach(e => {
    menuSteps.push({
      element: e,
      popover: {
        title: '菜单',
        description: e.getAttribute('data-description'),
        showButtons: ['next', 'previous', 'close'],
        side: 'left'
      }
    })
  })
  const driverObj = driver({
    popoverClass: 'driver-popover-custom-class',
    overlayColor: '#a1a3a6',
    showProgress: true,
    allowClose: false,
    doneBtnText: '完成',
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    progressText: '{{current}} / {{total}}',
    steps: [
      {
        popover: {
          title: '开始教程📕',
          description: '准备好了吗？',
          showButtons: ['next', 'previous', 'close']
        }
      },
      ...menuSteps,
      {
        element: '#driver-step-1',
        popover: {
          title: '菜单',
          description: '你可以点击该按钮展开或折叠菜单栏',
          showButtons: ['next', 'previous', 'close'],
          side: 'bottom'
        }
      },
      {
        element: '#driver-step-2',
        popover: {
          title: '消息控制台',
          description: '系统消息以及好友消息，记得点击这里查看与回复',
          showButtons: ['next', 'previous', 'close'],
          side: 'right'
        }
      },
      {
        element: '#driver-step-3',
        popover: {
          title: '我的',
          description: '如果想要查看个人信息，或者退出系统，可以点击该按钮',
          showButtons: ['next', 'previous', 'close'],
          side: 'bottom'
        }
      },
      { popover: { title: '教程完成🎉🎉🎉', description: '恭喜，你已经掌握了基础功能，开始愉快的使用吧！', showButtons: ['next', 'previous', 'close'] } }
    ],
    onPopoverRender: (popover, { config, state }) => {
      console.log('onPopoverRender', popover, { config, state })
      if (state?.activeStep?.popover?.nextBtnText === config?.doneBtnText) {
        return false
      }
      const firstButton = document.createElement('button')
      firstButton.innerText = '跳过'
      popover.footerButtons.appendChild(firstButton)
      firstButton.addEventListener('click', () => {
        driverObj.destroy()
      })
    },
    onNextClick: () => {
      driverObj.moveNext()
    },
    onPrevClick: () => {
      driverObj.movePrevious()
    },
    onCloseClick: () => {
      driverObj.destroy()
    },
    // onDestroyStarted: () => {
    //   driverObj.destroy()
    // },
    onDestroyed: () => {
      firstData.enterSys = false
      setFirstData(firstData)
    }
  })
  driverObj.drive()
}
