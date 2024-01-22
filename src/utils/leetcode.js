/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
export const twoSum = function (nums, target) {
  let reduceLength = 0
  let res = []
  while (nums.length > 0) {
    const first = nums.shift()
    nums.some((e, i) => {
      if (first + e === target) {
        res = [reduceLength, reduceLength + i + 1]
        return true
      }
      return false
    })
    reduceLength++
    if (res.length !== 0) {
      break
    }
  }
  return res
}
// @lc code=end

/*
 * @lc app=leetcode.cn id=9 lang=javascript
 *
 * [9] 回文数
 */

// @lc code=start
/**
 * @param {number} x
 * @return {boolean}
 */
export const isPalindrome = function (x) {
  x = x.toString()
  if (x.length === 1) {
    return true
  }
  // 向下取整
  const half = Math.floor(x.length / 2)
  let x1, x2
  if (x.length % 2 === 0) {
    x1 = x.slice(0, half)
    x2 = x.slice(half, x.length)
    // 偶数
  } else {
    x1 = x.slice(0, half)
    x2 = x.slice(half + 1, x.length)
    // 奇数
  }
  return x1 === x2.split('').reverse().join('')
}
// @lc code=end
