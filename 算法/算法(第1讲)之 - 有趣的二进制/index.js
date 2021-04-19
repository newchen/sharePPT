
// -------------------------------封装-------------------------------------
class Permission {
  constructor(permissions = {}) {
    this.userCode = ''; // 当前用户已有的"权限code", 初始时为空, 然后不断对它进行操作: 添加/删除/判断/列出 权限
    this.permissions = permissions; // 总的权限列表
  }
  // 设置权限列表
  setPermissions(permissions) {
    this.permissions = permissions;
  }

  handlePermission(permission) {
    let { userCode } = this

    const userPermission = userCode ? userCode.split(",") : []
    // index表示"权限空间", pos是"权限code"
    let [index, pos] = permission.value.split(",")

    // 去除左右空格
    index = index.trim();
    pos = pos.trim();
    
    // 校验"权限code"
    if (parseInt(pos) > 30) {
      throw new Error('权限code不能大于30');
    }

    return { userPermission, index, pos }
  }
  // 添加权限
  add(permission) {
    const { 
      userPermission, 
      index, pos 
    } = this.handlePermission(permission)
  
    // PS: 0 | number === number, 即: 0与任何数 '按位或' 都还是原来那个数
    userPermission[index] = (userPermission[index] || 0) | Math.pow(2, pos)
    this.userCode = userPermission.join(",")

    return this
  }
  // 删除权限
  del(permission) {
    const { 
      userPermission, 
      index, pos 
    } = this.handlePermission(permission)

    // PS: 0 & number === 0, 即: 0与任何数 '按位与' 都是0, 而0的话就表示删除了权限
    userPermission[index] = (userPermission[index] || 0) & (~Math.pow(2, pos))
    this.userCode = userPermission.join(",")

    return this
  }
  // 判断是否有权限
  has(permission) {
    const { 
      userPermission, 
      index, pos 
    } = this.handlePermission(permission)

    const permissionValue = Math.pow(2, pos)
  
    return (userPermission[index] & permissionValue) === permissionValue
  }
  // 列出用户拥有的全部权限
  list() {
    let { 
      userCode,
      permissions,
      // has
    } = this;

    const results = []

    if (!userCode) {
      return results
    }

    Object.values(permissions).forEach(permission => {
      // if (has(permission)) { // this指向问题
      if (this.has(permission)) {
        results.push(permission)
      }
    })

    return results
  }
  // 打印
  log() {
    const results = this.list()
    console.log(`拥有权限: ${JSON.stringify(results, null, " ")}`)
  }
}


// -------------------------------定义权限------------------------------------
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

// -------------------------------使用-------------------------------------
let obj = new Permission(permissions)

obj.add(permissions.SYS_SETTING)
console.log(obj.userCode) // 1
obj.log()
// 拥有权限: [
//   {
//    "value": "0,0",
//    "info": "系统权限"
//   }
//  ]

obj.add(permissions.POST_EDIT)
console.log(obj.userCode) // 1,,16
obj.log()
// 拥有权限: [
//   {
//    "value": "0,0",
//    "info": "系统权限"
//   },
//   {
//    "value": "2,4",
//    "info": "文章编辑权限"
//   }
//  ]

obj.add(permissions.USER_EDIT)
console.log(obj.userCode) // 1073741825,,16
obj.log()
// 拥有权限: [
//   {
//    "value": "0,0",
//    "info": "系统权限"
//   },
//   {
//    "value": "0,30",
//    "info": "用户编辑权限"
//   },
//   {
//    "value": "2,4",
//    "info": "文章编辑权限"
//   }
//  ]

obj.add(permissions.USER_DELETE)
obj.log()
// 拥有权限: [
//   {
//    "value": "0,0",
//    "info": "系统权限"
//   },
//   {
//    "value": "0,30",
//    "info": "用户编辑权限"
//   },
//   {
//    "value": "1,17",
//    "info": "用户删除权限"
//   },
//   {
//    "value": "2,4",
//    "info": "文章编辑权限"
//   }
//  ]

obj.del(permissions.USER_EDIT)
obj.log()
// 拥有权限: [
//   {
//    "value": "0,0",
//    "info": "系统权限"
//   },
//   {
//    "value": "1,17",
//    "info": "用户删除权限"
//   },
//   {
//    "value": "2,4",
//    "info": "文章编辑权限"
//   }
//  ]

obj.del(permissions.USER_EDIT)
obj.log()
// 拥有权限: [
//   {
//    "value": "0,0",
//    "info": "系统权限"
//   },
//   {
//    "value": "1,17",
//    "info": "用户删除权限"
//   },
//   {
//    "value": "2,4",
//    "info": "文章编辑权限"
//   }
//  ]

obj.del(permissions.USER_DELETE)
obj.del(permissions.SYS_SETTING)
obj.del(permissions.POST_EDIT)
obj.log()
// 拥有权限: []

obj.add(permissions.SYS_SETTING)
obj.log()
// 拥有权限: [
//   {
//    "value": "0,0",
//    "info": "系统权限"
//   }
//  ]