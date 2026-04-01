# FrontProject - Angular 前端项目

## 📖 项目简介

这是一个基于 **Angular 21** 的前端项目，使用 Docker + Nginx 进行容器化部署。项目提供了一个简洁的示例页面，展示如何调用后端 Spring Boot API 接口。

---

## 🛠️ 技术栈

### 核心框架
- **Angular**: 21.2.0
- **TypeScript**: 5.9.2
- **RxJS**: 7.8.0

### 开发工具
- **Angular CLI**: 21.2.2
- **@angular/build**: 21.2.2
- **Prettier**: 3.8.1（代码格式化工具）

### 运行环境
- **Node.js**: 20 (Alpine)
- **Nginx**: Alpine（生产环境）

---

## 📁 项目结构

```
front-project/
├── .gitignore                    # Git 忽略文件配置
├── .prettierrc                   # Prettier 格式化配置
├── Dockerfile                    # Docker 构建配置
├── angular.json                  # Angular CLI 配置
├── package.json                  # npm 依赖配置
├── package-lock.json             # npm 依赖锁定文件
├── tsconfig.json                 # TypeScript 配置
├── tsconfig.app.json             # TypeScript 应用配置
├── nginx/
│   └── default.conf              # Nginx 服务器配置
├── public/
│   └── favicon.ico               # 网站图标
└── src/
    ├── app/
    │   ├── app.ts                # 主组件（包含业务逻辑）
    │   └── app.config.ts         # 应用配置（HTTP 客户端等）
    ├── index.html                # HTML 入口文件
    ├── main.ts                   # 应用启动入口
    └── styles.css                # 全局样式
```

---

## 🚀 快速开始

### 方式一：Docker 部署（推荐 - 生产环境）

#### 1. 构建并启动容器

在项目根目录执行：

```bash
docker-compose up -d --build front-project
```

#### 2. 访问应用

打开浏览器访问：`http://localhost:8090`

#### 3. 查看日志

```bash
docker-compose logs -f front-project
```

#### 4. 停止服务

```bash
docker-compose down front-project
```

---

### 方式二：本地开发模式

#### 1. 安装依赖

```bash
npm install
```

#### 2. 启动开发服务器

```bash
ng serve
```

或指定端口：

```bash
ng serve --port 4200
```

#### 3. 访问应用

打开浏览器访问：`http://localhost:4200`

**特点：**
- ✅ 热更新支持（修改代码后自动刷新）
- ✅ 快速开发调试
- ⚠️ 仅用于开发环境，不建议用于生产

---

## 🌐 后端接口配置

### 当前配置

项目默认通过 **相对路径** 调用后端 API：

```typescript
this.http.get('/api/hello', { responseType: 'text' })
```

### Docker 环境下的代理配置

Nginx 配置中已设置 API 代理（`nginx/default.conf`）：

```nginx
location /api/ {
    proxy_pass http://backend:8080/api/;
    proxy_set_header Host $host;
}
```

**说明：**
- 前端请求 `/api/hello` 会被 Nginx 转发到后端服务的 `http://backend:8080/api/hello`
- 确保 `docker-compose.yml` 中定义了名为 `backend` 的服务

### 本地开发环境的代理配置

如果需要在本地开发时调用后端 API，可以创建 `proxy.conf.json`：

```json
{
  "/api": {
    "target": "http://localhost:8777",
    "secure": false,
    "changeOrigin": true
  }
}
```

然后启动时添加代理配置：

```bash
ng serve --proxy-config proxy.conf.json
```

---

## 💻 功能特性

### 1. HTTP 客户端集成

项目已全局配置 `HttpClient`，可以直接在组件中注入使用：

```typescript
constructor(private http: HttpClient) {}
```

### 2. Signal 响应式编程

使用 Angular 最新的 Signal API 进行状态管理：

```typescript
message = signal('初始值');
this.message.set('新值');
```

### 3. 跨域调用后端

提供按钮点击事件，调用后端接口并显示返回结果：

```typescript
callBackend() {
  this.message.set('正在请求...');
  this.http.get('/api/hello', { responseType: 'text' }).subscribe({
    next: (res) => this.message.set(res),
    error: (err) => this.message.set('调用失败：' + err.message),
  });
}
```

---

## 🔧 常用命令

### 开发相关

```bash
# 启动开发服务器
ng serve

# 启动开发服务器（指定端口）
ng serve --port 4200

# 生成新组件
ng generate component component-name

# 生成服务
ng generate service service-name

# 生成指令
ng generate directive directive-name
```

### 构建相关

```bash
# 构建项目（生产环境）
ng build

# 构建项目（开发环境）
ng build --configuration development

# 监听文件变化并自动构建
ng build --watch --configuration development
```

### Docker 相关

```bash
# 构建并启动所有服务
docker-compose up -d --build

# 只启动前端服务
docker-compose up -d front-project

# 重新构建前端镜像
docker-compose up -d --build front-project

# 查看日志
docker-compose logs -f front-project

# 停止所有服务
docker-compose down

# 停止并删除容器和镜像
docker-compose down -v
```

---

## 🐳 Docker 多阶段构建说明

本项目使用 **多阶段构建** 优化镜像大小：

### 第一阶段：构建 Angular 应用

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline 
COPY . .
RUN npm run build
```

**作用：**
- 安装依赖并构建 Angular 应用
- 生成生产环境的静态文件到 `dist/front-project/browser`

### 第二阶段：Nginx 提供服务

```dockerfile
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/front-project/browser /usr/share/nginx/html
EXPOSE 8080
```

**作用：**
- 使用轻量的 Nginx 镜像
- 复制构建产物到 Nginx 静态文件目录
- 使用自定义 Nginx 配置提供服务和 API 代理

**优势：**
- ✅ 最终镜像只包含 Nginx 和静态文件，体积极小（约 20MB）
- ✅ 不包含 Node.js、npm 等开发工具
- ✅ 安全性更高，攻击面更小

---

## 🎨 代码规范

### Prettier 格式化

项目使用 Prettier 进行代码格式化，配置文件为 `.prettierrc`。

**手动格式化代码：**

```bash
npx prettier --write "src/**/*.{ts,html,css}"
```

**检查代码格式：**

```bash
npx prettier --check "src/**/*.{ts,html,css}"
```

---

## 🔍 常见问题

### Q1: 为什么前端无法调用后端 API？

**可能原因：**
1. 后端服务未启动
2. Docker 网络配置问题
3. API 地址配置错误

**解决方案：**
- 确认后端服务正常运行：`curl http://localhost:8777/api/hello`
- 检查 `docker-compose.yml` 中是否有 `backend` 服务
- 确认 Nginx 配置中的 `proxy_pass` 地址正确

---

### Q2: 如何修改前端代码后快速生效？

**方案 A：本地开发模式（推荐）**

```bash
ng serve
```

修改代码后会自动刷新浏览器（热更新）。

**方案 B：Docker 快速重建**

```bash
docker-compose up -d --build front-project
```

构建时间约 30 秒 - 1 分钟。

---

### Q3: 如何添加新的组件？

使用 Angular CLI 生成：

```bash
ng generate component components/your-component-name
```

CLI 会自动生成：
- 组件 TypeScript 文件
- 模板文件（inline）
- 样式文件（inline）
- 测试文件（已跳过）

---

### Q4: 如何配置环境变量？

Angular 支持多环境配置：

**开发环境：** `environment.ts`
**生产环境：** `environment.prod.ts`

在 `angular.json` 中配置：

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  }
}
```

---

### Q5: 如何调试 Docker 容器中的问题？

**进入容器内部：**

```bash
docker exec -it front-frontend sh
```

**查看 Nginx 配置：**

```bash
cat /etc/nginx/conf.d/default.conf
```

**测试网络连接：**

```bash
ping backend
curl http://backend:8080/api/hello
```

---

## 📝 开发建议

### 1. 使用本地开发模式进行编码

```bash
ng serve
```

- ✅ 热更新，秒级反馈
- ✅ 便于调试
- ✅ 可以快速迭代

### 2. 使用 Docker 进行集成测试

```bash
docker-compose up -d --build
```

- ✅ 模拟真实生产环境
- ✅ 测试服务间通信
- ✅ 验证部署配置

### 3. 代码提交前检查

```bash
# 格式化代码
npx prettier --write "src/**/*.{ts,html,css}"

# 构建检查
ng build --configuration production
```

---

## 🎯 下一步

### 学习资源
- [Angular 官方文档](https://angular.dev/)
- [Angular CLI 命令参考](https://angular.dev/tools/cli)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [RxJS 文档](https://rxjs.dev/)

### 扩展建议
1. 添加路由模块实现多页面导航
2. 添加更多服务和组件
3. 集成状态管理（如 NgRx）
4. 添加单元测试和 E2E 测试
5. 配置 CI/CD 自动化部署

---

## 📄 许可证

本项目为私有项目，仅供学习和内部使用。

---

## 👥 维护者

如有问题，请联系项目负责人。
