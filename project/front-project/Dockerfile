# 第一阶段：构建 Angular 应用：使用 Node.js 20 的 Alpine 版本作为基础镜像，并命名为 build
# 使用固定版本的 Node.js Alpine 镜像以确保构建一致性
# 选择 Alpine 版本原因：体积极小（约 5MB），安全性高，适合容器化部署
FROM node:20.11.0-alpine3.19 AS build
# 设置工作目录。之后的命令（如 COPY、RUN）都会在这个目录下执行。如果目录不存在，会自动创建。这里设为 /app。
# /app 为中间镜像目录，不会存在于最终镜像中
# 为什么用 /app？这是 Docker 社区约定俗成的做法，简洁且避免与系统目录冲突
WORKDIR /app

# 复制包管理文件（利用 Docker 缓存层加速构建）
COPY package.json package-lock.json ./
# 安装依赖到 /app/node_modules/
RUN npm ci --prefer-offline --ignore-scripts
# 复制所有源代码到工作目录。注意：确保项目根目录有 .dockerignore 文件，排除 node_modules、.git 等不必要文件
COPY . .
# 构建生成静态文件到 /app/dist/front-project/browser/
# 包含：index.html、*.js、*.css、*.ico 等
RUN npm run build

# Docker 多阶段构建中，第一阶段生成的中间镜像并没有被自动删除，它仍然保存在你的 Docker 本地镜像缓存中，只是最终生成的镜像（第二阶段）不包含第一层的任何文件（除了你显式用 COPY --from=build 复制过来的部分）。所以当你运行最终容器时，自然看不到 /app 目录——它不在这个镜像里。
# 重要：此时的 /app/dist/front-project/browser 已经包含了所有构建好的静态文件（HTML、CSS、JS 等）
# 下一阶段只需要把这些文件复制到 Nginx 目录即可，不需要把整个 /app 都复制过去

# 第二阶段：使用 Nginx 提供静态文件服务
FROM nginx:1.25-alpine3.19
# 复制 Nginx 配置到 /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# 从第一阶段复制构建产物到 Nginx 默认目录 /usr/share/nginx/html/
# 复制后 Nginx 从此目录提供 Web 服务
COPY --from=build /app/dist/front-project/browser /usr/share/nginx/html

# 健康检查：启动后 60 秒内不检查（给启动时间），之后每 30 秒检查一次，超时 3 秒
# 连续失败 3 次标记为 unhealthy，成功 1 次恢复 healthy
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

EXPOSE 8080