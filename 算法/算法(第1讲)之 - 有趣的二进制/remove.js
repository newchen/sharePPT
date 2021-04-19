// ****************** 删除权限1 *****************
let r    = 0b100
let w    = 0b010
let x    = 0b001
let user = 0b110 // 有 r w 两个权限

// 执行异或操作，删除 r 权限
user = user ^ r

console.log((user & r) === r) // false 没有 r 权限
console.log((user & w) === w) // true  有 w 权限
console.log((user & x) === x) // false 没有 x 权限

console.log(user.toString(2)) // 现在 user 是 0b010

// 再执行一次异或操作
user = user ^ r

console.log((user & r) === r) // true  有 r 权限
console.log((user & w) === w) // true  有 w 权限
console.log((user & x) === x) // false 没有 x 权限

console.log(user.toString(2)) // 现在 user 又变回 0b110


// ****************** 删除权限2 *****************

let r    = 0b100
let w    = 0b010
let x    = 0b001
let user = 0b110 // 有 r w 两个权限

// 删除 r 权限
user = user & (~r)

console.log((user & r) === r) // false 没有 r 权限
console.log((user & w) === w) // true  有 w 权限
console.log((user & x) === x) // false 没有 x 权限

console.log(user.toString(2)) // 现在 user 是 0b010

// 再执行一次
user = user & (~r)

console.log((user & r) === r) // false 没有 r 权限
console.log((user & w) === w) // true  有 w 权限
console.log((user & x) === x) // false 没有 x 权限

console.log(user.toString(2)) // 现在 user 还是 0b010，并不会新增