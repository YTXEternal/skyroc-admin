# API 文档

本文档记载了 Skyroc Admin 项目的 API 接口详情，包括请求参数、请求头、路径、完整响应示例及响应类型定义。

## 全局配置

### 请求头 (Request Headers)

所有请求（登录接口除外）通常需要携带以下 Header：

| Header Key | Value | 说明 |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <token>` | 用户访问令牌，登录后获取 |
| `apifoxToken` | `XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2` | Apifox 调试 Token |

### 响应结构

后端通常返回如下统一结构的 JSON：

```json
{
  "code": "0000",
  "msg": "操作成功",
  "data": { ... } // 具体接口返回的数据
}
```

**注意：** 本文档中的“响应示例”和“响应类型”仅展示 `data` 字段的内容，即前端 `request` 方法自动解包后的数据。

---

## 1. 认证模块 (Auth)

### 1.1 登录 (Login)

*   **路径**: `/auth/login`
*   **方法**: `POST`
*   **描述**: 用户登录获取 Token。

#### 请求参数 (Body)

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `userName` | string | 是 | 用户名 |
| `password` | string | 是 | 密码 |

#### 响应类型 (TypeScript)

```typescript
interface LoginToken {
  /** 刷新令牌 */
  refreshToken: string;
  /** 访问令牌 */
  token: string;
}
```

#### 响应示例

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySW...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySW..."
}
```

---

### 1.2 获取用户信息 (Get User Info)

*   **路径**: `/auth/getUserInfo`
*   **方法**: `GET`
*   **描述**: 获取当前登录用户的详细信息、角色和权限。

#### 请求参数

无

#### 响应类型 (TypeScript)

```typescript
interface UserInfo {
  /** 用户按钮权限列表 */
  buttons: string[];
  /** 用户角色列表 */
  roles: string[];
  /** 用户 ID */
  userId: string;
  /** 用户名 */
  userName: string;
}
```

#### 响应示例

```json
{
  "userId": "1",
  "userName": "Admin",
  "roles": ["R_SUPER", "R_ADMIN"],
  "buttons": ["sys:user:add", "sys:user:edit"]
}
```

---

### 1.3 刷新 Token (Refresh Token)

*   **路径**: `/auth/refreshToken`
*   **方法**: `POST`
*   **描述**: 使用刷新令牌换取新的访问令牌。

#### 请求参数 (Body)

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `refreshToken` | string | 是 | 刷新令牌 |

#### 响应类型 (TypeScript)

```typescript
interface LoginToken {
  /** 刷新令牌 */
  refreshToken: string;
  /** 访问令牌 */
  token: string;
}
```

#### 响应示例

```json
{
  "token": "new_access_token_...",
  "refreshToken": "new_refresh_token_..."
}
```

---

## 2. 系统管理模块 (System Manage)

### 2.1 获取角色列表 (Get Role List)

*   **路径**: `/systemManage/getRoleList`
*   **方法**: `GET`
*   **描述**: 分页获取角色列表。

#### 请求参数 (Query)

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `current` | number | 是 | 当前页码 |
| `size` | number | 是 | 每页条数 |
| `roleCode` | string | 否 | 角色编码 |
| `roleName` | string | 否 | 角色名称 |
| `status` | string | 否 | 状态 ("1": 启用, "2": 禁用) |

#### 响应类型 (TypeScript)

```typescript
/** 角色对象 */
type Role = {
  id: number;
  roleCode: string; // 角色编码
  roleDesc: string; // 角色描述
  roleName: string; // 角色名称
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  status: "1" | "2" | null; // 1:启用, 2:禁用
};

/** 分页响应 */
type RoleList = {
  current: number;
  size: number;
  total: number;
  records: Role[];
};
```

#### 响应示例

```json
{
  "current": 1,
  "size": 10,
  "total": 50,
  "records": [
    {
      "id": 1,
      "roleCode": "R_ADMIN",
      "roleName": "管理员",
      "roleDesc": "系统管理员，拥有所有权限",
      "createBy": "system",
      "createTime": "2023-01-01 12:00:00",
      "updateBy": "system",
      "updateTime": "2023-01-02 12:00:00",
      "status": "1"
    },
    {
      "id": 2,
      "roleCode": "R_USER",
      "roleName": "普通用户",
      "roleDesc": "普通注册用户",
      "createBy": "system",
      "createTime": "2023-01-01 12:00:00",
      "updateBy": "system",
      "updateTime": "2023-01-02 12:00:00",
      "status": "1"
    }
  ]
}
```

---

### 2.2 获取所有角色 (Get All Roles)

*   **路径**: `/systemManage/getAllRoles`
*   **方法**: `GET`
*   **描述**: 获取所有启用角色的简化列表（常用于下拉选择）。

#### 请求参数

无

#### 响应类型 (TypeScript)

```typescript
type AllRole = {
  id: number;
  roleCode: string;
  roleName: string;
};
```

#### 响应示例

```json
[
  { "id": 1, "roleCode": "R_ADMIN", "roleName": "管理员" },
  { "id": 2, "roleCode": "R_USER", "roleName": "普通用户" }
]
```

---

### 2.3 获取用户列表 (Get User List)

*   **路径**: `/systemManage/getUserList`
*   **方法**: `GET`
*   **描述**: 分页获取用户列表。

#### 请求参数 (Query)

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `current` | number | 是 | 当前页码 |
| `size` | number | 是 | 每页条数 |
| `userName` | string | 否 | 用户名 |
| `nickName` | string | 否 | 昵称 |
| `userGender` | string | 否 | 性别 ("1": 男, "2": 女) |
| `userPhone` | string | 否 | 手机号 |
| `userEmail` | string | 否 | 邮箱 |
| `status` | string | 否 | 状态 |

#### 响应类型 (TypeScript)

```typescript
/** 用户对象 */
type User = {
  id: number;
  userName: string;
  nickName: string;
  userPhone: string;
  userEmail: string;
  userGender: "1" | "2" | null;
  userRoles: string[]; // 角色编码集合
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  status: "1" | "2" | null;
};

/** 分页响应 */
type UserList = {
  current: number;
  size: number;
  total: number;
  records: User[];
};
```

#### 响应示例

```json
{
  "current": 1,
  "size": 10,
  "total": 100,
  "records": [
    {
      "id": 101,
      "userName": "admin",
      "nickName": "超级管理员",
      "userPhone": "13800138000",
      "userEmail": "admin@example.com",
      "userGender": "1",
      "userRoles": ["R_ADMIN"],
      "createBy": "system",
      "createTime": "2023-01-01 10:00:00",
      "updateBy": "system",
      "updateTime": "2023-01-05 10:00:00",
      "status": "1"
    }
  ]
}
```

---

### 2.4 获取菜单列表 (Get Menu List)

*   **路径**: `/systemManage/getMenuList/v2`
*   **方法**: `GET`
*   **描述**: 分页获取菜单列表。

#### 请求参数

无 (代码中未定义特定参数，通常支持分页)

#### 响应类型 (TypeScript)

```typescript
type MenuButton = {
  code: string; // 按钮编码
  desc: string; // 按钮描述
};

type Menu = {
  id: number;
  menuName: string; // 菜单名称
  menuType: "1" | "2"; // 1:目录, 2:菜单
  parentId: number; // 父级ID
  routeName: string; // 路由名称
  routePath: string; // 路由路径
  component?: string; // 组件路径
  icon: string; // 图标
  iconType: "1" | "2"; // 1:iconify, 2:本地
  buttons?: MenuButton[] | null;
  children?: Menu[] | null;
  // ...以及其他路由属性 (hideInMenu, order, i18nKey等)
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  status: "1" | "2" | null;
};

type MenuList = {
  current: number;
  size: number;
  total: number;
  records: Menu[];
};
```

#### 响应示例

```json
{
  "current": 1,
  "size": 20,
  "total": 5,
  "records": [
    {
      "id": 1,
      "parentId": 0,
      "menuName": "系统管理",
      "menuType": "1",
      "routeName": "system",
      "routePath": "/system",
      "icon": "mdi:settings",
      "iconType": "1",
      "order": 1,
      "status": "1",
      "createBy": "system",
      "createTime": "2023-01-01",
      "updateBy": "system",
      "updateTime": "2023-01-01",
      "children": [
        {
          "id": 2,
          "parentId": 1,
          "menuName": "用户管理",
          "menuType": "2",
          "routeName": "system_user",
          "routePath": "/system/user",
          "component": "layout.base$view.system_user",
          "icon": "mdi:account",
          "iconType": "1",
          "status": "1",
          "buttons": [
            { "code": "sys:user:add", "desc": "新增用户" }
          ]
        }
      ]
    }
  ]
}
```

---

### 2.5 获取所有页面组件 (Get All Pages)

*   **路径**: `/systemManage/getAllPages`
*   **方法**: `GET`
*   **描述**: 获取前端所有可用的页面组件路径列表。

#### 请求参数

无

#### 响应类型 (TypeScript)

```typescript
type PageList = string[];
```

#### 响应示例

```json
[
  "view.login_index",
  "view.system_user_index",
  "view.system_role_index",
  "view.about_index"
]
```

---

### 2.6 获取菜单树 (Get Menu Tree)

*   **路径**: `/systemManage/getMenuTree`
*   **方法**: `GET`
*   **描述**: 获取菜单树形结构（简化的 id/label 结构，用于选择父级菜单等）。

#### 请求参数

无

#### 响应类型 (TypeScript)

```typescript
interface MenuTree {
  id: number;
  label: string;
  pId: number;
  children?: MenuTree[];
}
```

#### 响应示例

```json
[
  {
    "id": 1,
    "label": "系统管理",
    "pId": 0,
    "children": [
      {
        "id": 2,
        "label": "用户管理",
        "pId": 1
      },
      {
        "id": 3,
        "label": "角色管理",
        "pId": 1
      }
    ]
  }
]
```

---

## 3. 路由模块 (Route)

### 3.1 获取常量路由 (Get Constant Routes)

*   **路径**: `/route/getConstantRoutes`
*   **方法**: `GET`
*   **描述**: 获取无需权限即可访问的常量路由。

#### 请求参数

无

#### 响应类型 (TypeScript)

```typescript
interface MenuRoute {
  id: string;
  // ...ElegantConstRoute 属性
  name: string;
  path: string;
  component?: string;
  meta?: {
    title: string;
    i18nKey?: string;
  };
}
```

#### 响应示例

```json
[
  {
    "id": "login",
    "name": "login",
    "path": "/login",
    "component": "layout.blank$view.login",
    "meta": {
      "title": "Login",
      "i18nKey": "route.login"
    }
  }
]
```

### 3.2 获取后端路由 (Get Backend Routes)

*   **路径**: `/route/getReactUserRoutes`
*   **方法**: `GET`
*   **描述**: 获取当前用户有权限访问的后端路由表（完整结构）。

#### 请求参数

无

#### 响应类型 (TypeScript)

```typescript
interface BackendRouteResponse {
  /** 用户首页路由键 */
  home: string;
  /** 用户可访问的路由列表 */
  routes: BackendRoute[];
}

interface BackendRoute {
  name: string;
  path: string;
  component?: string;
  layout?: string;
  redirect?: string;
  children?: BackendRoute[];
  handle: {
    title?: string;
    icon?: string;
    order?: number;
    // ...其他元数据
  };
}
```

#### 响应示例

```json
{
  "home": "dashboard_analysis",
  "routes": [
    {
      "name": "dashboard",
      "path": "/dashboard",
      "component": "layout.base",
      "handle": {
        "title": "仪表盘",
        "icon": "mdi:monitor-dashboard",
        "order": 1
      },
      "children": [
        {
          "name": "dashboard_analysis",
          "path": "/dashboard/analysis",
          "component": "view.dashboard_analysis",
          "handle": {
            "title": "分析页",
            "icon": "mdi:chart-line"
          }
        }
      ]
    }
  ]
}
```

### 3.3 获取用户路由 (Get User Routes)

*   **路径**: `/route/getUserRoutes`
*   **方法**: `GET`
*   **描述**: 获取用户可访问的路由列表（仅包含路由名称）。

#### 请求参数

无

#### 响应类型 (TypeScript)

```typescript
interface UserRoute {
  /** 用户首页路由键 */
  home: string;
  /** 用户可访问的路由列表 */
  routes: string[];
}
```

#### 响应示例

```json
{
  "home": "dashboard_analysis",
  "routes": [
    "dashboard",
    "dashboard_analysis",
    "system",
    "system_user"
  ]
}
```

### 3.4 检查路由是否存在 (Is Route Exist)

*   **路径**: `/route/isRouteExist`
*   **方法**: `GET`
*   **描述**: 检查指定的路由名称是否存在。

#### 请求参数 (Query)

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `routeName` | string | 是 | 路由名称 |

#### 响应类型 (TypeScript)

```typescript
type Result = boolean;
```

#### 响应示例

```json
true
```
