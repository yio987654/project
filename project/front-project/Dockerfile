# 第一阶段：构建 Angular 应用
FROM node:20-alpine AS build
# 设置工作目录。之后的命令（如 COPY、RUN）都会在这个目录下执行。如果目录不存在，会自动创建。这里设为 /app。
#/app 为中间镜像目录，不会存在于镜像中
WORKDIR /app
COPY package.json package-lock.json ./
# 根据 package-lock.json 精确安装所有依赖，比 npm install 更快、更可靠，适合自动化构建。
RUN npm ci --prefer-offline 
COPY . .
# 运行构建命令。在 package.json 的 scripts 中，build 通常定义为 ng build，它会生成生产环境的静态文件，默认输出到 dist/ 目录下（具体路径取决于 Angular 配置）。对于这个项目，输出路径是 /app/dist/front-project/browser。
RUN npm run build

#在 Docker 多阶段构建中，第一阶段生成的中间镜像并没有被自动删除，它仍然保存在你的 Docker 本地镜像缓存中，只是最终生成的镜像（第二阶段）不包含第一层的任何文件（除了你显式用 COPY --from=build 复制过来的部分）。所以当你运行最终容器时，自然看不到 /app 目录——它不在这个镜像里。

# 第二阶段：运行 Nginx 提供服务
FROM nginx:alpine
# 复制自定义 Nginx 配置
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# --from=build：从第一阶段（名为 build）的镜像中复制文件。这里复制的是第一阶段构建好的静态文件（/app/dist/front-project/browser 目录下的所有内容）到当前阶段容器的 /usr/share/nginx/html 目录，这是 Nginx 默认的静态文件根目录。
COPY --from=build /app/dist/front-project/browser /usr/share/nginx/html

EXPOSE 8080