# ===========================================
# 阶段 1: 依赖安装
# ===========================================
FROM node:22-alpine AS deps

RUN npm config set registry https://registry.npmmirror.com
# 安装 pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# 复制 package 文件
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/mobile/package.json ./apps/mobile/
COPY packages/ui/package.json ./packages/ui/
COPY packages/schemas/package.json ./packages/schemas/


# 安装依赖
RUN pnpm install --frozen-lockfile

# ===========================================
# 阶段 2: 构建
# ===========================================
FROM node:22-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# 复制 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 构建所有服务
RUN pnpm build

# ===========================================
# 阶段 3: 运行时
# ===========================================
FROM node:22-alpine AS runner

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com

# 安装 PM2
RUN npm install -g pm2

# 创建非 root 用户 (Alpine 使用 addgroup/adduser)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

# 从构建阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 复制构建产物
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/.output ./apps/web/.output
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/mobile/.output ./apps/mobile/.output
COPY --from=builder /app/apps/mobile/package.json ./apps/mobile/
COPY --from=builder /app/packages/ui ./packages/ui
COPY --from=builder /app/packages/schemas ./packages/schemas
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/package.json ./package.json

# 复制 PM2 配置
COPY ecosystem.config.js ./

# 设置权限
RUN chown -R nodejs:nodejs /app

# 暴露端口
EXPOSE 3000 3001 3002

# 切换到非 root 用户
USER nodejs

# 启动 PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
