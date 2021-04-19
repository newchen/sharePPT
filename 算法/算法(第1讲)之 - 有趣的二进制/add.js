// ****************** 添加权限 *****************

let r = 0b100
let w = 0b010
let x = 0b001

// 给用户赋全部权限（使用前面讲的 | 操作）
let user = r | w | x

console.log(user)
// 7

console.log(user.toString(2))
// 111

//     r = 0b100
//     w = 0b010
//     r = 0b001
// r|w|x = 0b111