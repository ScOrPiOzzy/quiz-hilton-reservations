# 数据库初始化脚本

本脚本用于自动创建 Couchbase 数据库的 bucket 和 collection。

## 使用方法

### 1. 确保 Couchbase 服务器正在运行

如果你使用 Docker：

```bash
docker run -d \
  --name couchbase \
  -p 8091-8096:8091-8096 \
  -p 11210-11211:11210-11211 \
  -e COUCHBASE_ADMINISTRATOR_USERNAME=admin \
  -e COUCHBASE_ADMINISTRATOR_PASSWORD=hiltonadmin \
  couchbase:community-7.2.0
```

### 2. 运行初始化脚本

```bash
npm run db:init
```

### 3. 验证

启动应用：

```bash
npm run start
```

## 环境变量

脚本会读取以下环境变量（如果未设置则使用默认值）：

| 变量 | 默认值 | 说明 |
|------|---------|------|
| `COUCHBASE_HOST` | localhost | Couchbase 服务器地址 |
| `COUCHBASE_USERNAME` | admin | Couchbase 用户名 |
| `COUCHBASE_PASSWORD` | password | Couchbase 密码 |
| `COUCHBASE_BUCKET` | hilton | Bucket 名称 |

## 创建的 Bucket 和 Collection

脚本会创建以下资源：

- **Bucket**: `hilton`
  - **Scope**: `_default`
    - **Collection**: `_default` (默认 collection)
    - **Collection**: `User` (用户数据)
    - **Collection**: `Reservation` (预订数据)
    - **Collection**: `Hotel` (酒店数据)
    - **Collection**: `Restaurant` (餐厅数据)

## 故障排除

### 认证失败

如果看到 `AuthenticationFailureError`，请检查：
1. Couchbase 服务器是否正在运行
2. `.env` 文件中的连接配置是否正确
3. 用户名和密码是否匹配

### Bucket 已存在

脚本会自动检测 bucket 是否已存在。如果 bucket 已存在，会跳过创建步骤。

### Collection 已存在

脚本会自动检测 collection 是否已存在。如果 collection 已存在，会跳过创建步骤。
