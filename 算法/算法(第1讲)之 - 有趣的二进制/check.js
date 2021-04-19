// ****************** 校验权限 *****************

let r = 0b100
let w = 0b010
let x = 0b001

// 给用户赋 r w 两个权限
let user = r | w
// user = 6
// user = 0b110 (二进制)

console.log((user & r) === r) // true  有 r 权限
console.log((user & w) === w) // true  有 w 权限
console.log((user & x) === x) // false 没有 x 权限