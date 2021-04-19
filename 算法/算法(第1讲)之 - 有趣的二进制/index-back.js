// 用户的权限 code
let userCode = "";

// 添加权限
const addPermission = (permission) => {
  const userPermission = userCode ? userCode.split(",") : []
  const [index, pos] = permission.value.split(",")

  if (parseInt(pos) > 30) throw new Error('权限code不能大于30');

  // PS: 0 | number === number, 即: 0与任何数 按位或 都还是原来那个数
  userPermission[index] = (userPermission[index] || 0) | Math.pow(2, pos)

  return userPermission.join(",") // 返回userCode
}

// 删除权限
const delPermission = (permission) => {
  const userPermission = userCode ? userCode.split(",") : []
  const [index, pos] = permission.value.split(",")

  if (parseInt(pos) > 30) throw new Error('权限code不能大于30');

  // 0 & (~number) === 0
  userPermission[index] = (userPermission[index] || 0) & (~Math.pow(2, pos))

  return userPermission.join(",")
}

// 判断是否有权限
const hasPermission = (permission) => {
  const userPermission = userCode ? userCode.split(",") : []
  const [index, pos] = permission.value.split(",")
  const permissionValue = Math.pow(2, pos)

  return (userPermission[index] & permissionValue) === permissionValue
}

// 列出用户拥有的全部权限
const listPermission = permissions => {
  const results = []

  if (!userCode) {
    return results
  }

  Object.values(permissions).forEach(permission => {
    if (hasPermission(permission)) {
      results.push(permission.info)
    }
  })

  return results
}

const log = (permissions) => {
  console.log(`userCode: ${JSON.stringify(userCode, null, " ")}`)
  console.log(`权限列表: ${listPermission(permissions).join("; ")}`)
  console.log("")
}


// -------------------------------定义权限----------------------------------------
// 假设系统里有这些权限
// 纯模拟，正常情况下是按顺序的，如 0,0 0,1 0,2 ...，尽可能占满一个权限空间，再使用下一个
const permissions = {
  SYS_SETTING: {
    value: "0,0",   // index = 0, pos = 0
    info: "系统权限"
  },
  DATA_ADMIN: {
    value: "0,8",
    info: "数据库权限"
  },
  USER_ADD: {
    value: "0,22",
    info: "用户新增权限"
  },
  USER_EDIT: {
    value: "0,30",
    info: "用户编辑权限"
  },
  USER_VIEW: {
    value: "1,2",   // index = 1, pos = 2
    info: "用户查看权限"
  },
  USER_DELETE: {
    value: "1,17",
    info: "用户删除权限"
  },
  POST_ADD: {
    value: "1,28",
    info: "文章新增权限"
  },
  POST_EDIT: {
    value: "2,4",
    info: "文章编辑权限"
  },
  POST_VIEW: {
    value: "2,19",
    info: "文章查看权限"
  },
  POST_DELETE: {
    value: "2,26",
    info: "文章删除权限"
  }
}

// -------------------------------使用----------------------------------------

// userCode初始时为空, 然后不断对它进行操作: 添加/删除/判断/列出 权限
addPermission(permissions.SYS_SETTING)
log(permissions)
// userCode: "1"
// 权限列表: 系统权限

addPermission(permissions.POST_EDIT)
log(permissions)
// userCode: "1,,16"
// 权限列表: 系统权限; 文章编辑权限

addPermission(permissions.USER_EDIT)
log(permissions)
// userCode: "1073741825,,16"
// 权限列表: 系统权限; 用户编辑权限; 文章编辑权限

addPermission(permissions.USER_DELETE)
log(permissions)
// userCode: "1073741825,131072,16"
// 权限列表: 系统权限; 用户编辑权限; 用户删除权限; 文章编辑权限

delPermission(permissions.USER_EDIT)
log(permissions)
// userCode: "1,131072,16"
// 权限列表: 系统权限; 用户删除权限; 文章编辑权限

delPermission(permissions.USER_EDIT)
log(permissions)
// userCode: "1,131072,16"
// 权限列表: 系统权限; 用户删除权限; 文章编辑权限

delPermission(permissions.USER_DELETE)
delPermission(permissions.SYS_SETTING)
delPermission(permissions.POST_EDIT)
log(permissions)
// userCode: "0,0,0"
// 权限列表: 

addPermission(permissions.SYS_SETTING)
log(permissions)
// userCode: "1,0,0"
// 权限列表: 系统权限





