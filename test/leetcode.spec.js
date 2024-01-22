import { twoSum, isPalindrome } from '../src/utils/leetcode'

test('示例测试用例', () => {
  expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1])
  expect(twoSum([3, 2, 4], 6)).toEqual([1, 2])
  expect(twoSum([3, 3], 6)).toEqual([0, 1])
})

test('边界测试用例', () => {
  expect(twoSum([], 0)).toEqual([])
  expect(twoSum([1], 1)).toEqual([])
  expect(twoSum([1, 2], 3)).toEqual([0, 1])
})

test('特殊情况测试用例', () => {
  expect(twoSum([-1, -2, -3, -4, -5], -8)).toEqual([2, 4])
  expect(twoSum([1, 2, 3, 4, 5], 10)).toEqual([])
})

test('示例测试用例', () => {
  expect(isPalindrome(121)).toBe(true)
  expect(isPalindrome(-121)).toBe(false)
  expect(isPalindrome(10)).toBe(false)
})

test('边界测试用例', () => {
  expect(isPalindrome(0)).toBe(true)
  expect(isPalindrome(1)).toBe(true)
  expect(isPalindrome(-1)).toBe(false)
})

test('特殊情况测试用例', () => {
  expect(isPalindrome(1234567890987654321n)).toBe(true)
  expect(isPalindrome(123456789)).toBe(false)
})
