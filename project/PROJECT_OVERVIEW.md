# 项目结构概述

**最后更新：** 2026-04-02  
**项目类型：** Spring Boot + Angular 前后端分离项目

---

## 📁 整体架构

```
project/
├── backend/              # Spring Boot 后端（Java 17）
├── front-project/        # Angular 前端（Angular 21）
├── docker-compose.yml    # Docker 编排配置
└── logs/                 # 日志目录
```

---

## 🔧 技术栈

### **后端技术栈**
| 组件 | 版本 | 说明 |
|------|------|------|
| Java | 17 | JDK 版本 |
| Spring Boot | 3.2.0 | 主框架 |
| Spring AI | 1.0.0 | AI 模型集成 |
| ZhiPuAI | - | 智谱 AI Chat Model |
| Maven | 3.8 | 构建工具 |

### **前端技术栈**
| 组件 | 版本 | 说明 |
|------|------|------|
| Angular | 21.2.0 | 主框架 |
| TypeScript | 5.9.2 | 开发语言 |
| RxJS | 7.8.0 | 响应式编程 |
| Angular Build | 21.2.2 | 构建工具 |
| Prettier | 3.8.1 | 代码格式化 |

### **容器化**
| 组件 | 版本 | 说明 |
|------|------|------|
| Docker Compose | 3.8 | 编排工具 |
| Nginx | 1.25-alpine | 前端 Web 服务器 |
| Eclipse Temurin | 17-jre | 后端 JRE 运行环境 |

---

## 📂 后端项目详解 (backend/)

### **目录结构**
```
backend/
├── src/main/
│   ├── java/com/example/
│   │   ├── BackendApplication.java      # 主启动类
│   │   ├── HelloController.java         # 测试接口 Controller
│   │   └── AiController.java            # AI 接口 Controller
│   └── resources/
│       └── application.properties       # 配置文件
├── Dockerfile                           # Docker 构建配置
└── pom.xml                              # Maven 依赖配置
```

### **核心文件说明**

#### **1. BackendApplication.java**
- **路径：** `src/main/java/com/example/BackendApplication.java`
- **作用：** Spring Boot 主启动类
- **功能：** 
  - 使用 `@SpringBootApplication` 注解
  - 启动时打印日志信息
  - 端口：8080（容器内）

#### **2. HelloController.java**
- **路径：** `src/main/java/com/example/HelloController.java`
- **作用：** REST API 测试接口
- **接口：** `GET /api/hello`
- **返回：** `"Hello from Spring Boot!"`
- **日志：** 记录访问信息到 `/app/logs/spring.log`

#### **3. AiController.java**
- **路径：** `src/main/java/com/example/AiController.java`
- **作用：** AI 对话接口
- **接口：** `POST /api/ai/prompt`
- **请求体：** `{ "prompt": "用户问题" }`
- **响应体：** `{ "reply": "AI 回复" }`
- **依赖：** ZhiPuAiChatModel（智谱 AI）

#### **4. application.properties**
- **路径：** `src/main/resources/application.properties`
- **关键配置：**
```properties
server.port=8080
logging.file.path=./logs

# ZhiPuAI 配置
spring.ai.zhipuai.api-key=YOUR_ZHIPU_API_KEY
spring.ai.zhipuai.chat.options.model=glm-4-flash
```
- **⚠️ 注意：** API Key 需要手动填写

### **Dockerfile 解析**
```dockerfile
# 阶段 1：构建
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline          # 离线下载依赖
COPY src ./src
RUN mvn clean package -DskipTests      # 打包跳过测试

# 阶段 2：运行
FROM eclipse-temurin:17-jre
WORKDIR /app
ENV TZ=Asia/Shanghai                   # 设置时区
COPY --from=build /app/target/*.jar app.jar
EXPOSE 7776                            # ⚠️ 实际暴露 7776 端口
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### **启动命令**
```bash
# 本地开发
cd backend
mvn spring-boot:run

# Docker 启动
docker-compose up backend
```

### **API 接口列表**
| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | /api/hello | 测试接口 | 无 |
| POST | /api/ai/prompt | AI 对话 | `{ prompt: string }` |

---

## 🎨 前端项目详解 (front-project/)

### **目录结构**
```
front-project/
├── src/
│   ├── app/
│   │   ├── app.config.ts           # Angular 配置
│   │   └── app.ts                  # 主组件
│   ├── index.html                  # HTML 入口
│   ├── main.ts                     # TypeScript 入口
│   └── styles.css                  # 全局样式
├── nginx/
│   └── default.conf                # Nginx 配置
├── public/                         # 静态资源
├── .dockerignore                   # Docker 忽略文件
├── Dockerfile                      # Docker 构建配置
├── angular.json                    # Angular 配置
├── package.json                    # npm 依赖配置
└── tsconfig.json                   # TypeScript 配置
```

### **核心文件说明**

#### **1. app.ts**
- **路径：** `src/app/app.ts`
- **作用：** Angular 根组件
- **功能：**
  - 显示标题：`Hello yio, front-project`
  - 按钮：调用后端 `/api/hello` 接口
  - 显示后端返回消息
- **关键代码：**
```typescript
callBackend() {
  this.http.get('/api/hello', { responseType: 'text' }).subscribe({
    next: (res) => this.message.set(res),
    error: (err) => this.message.set('调用失败：' + err.message),
  });
}
```

#### **2. default.conf (Nginx 配置)**
- **路径：** `nginx/default.conf`
- **作用：** Nginx 反向代理配置
- **关键配置：**
```nginx
server {
    listen 8080;
    root /usr/share/nginx/html;
    
    # Angular 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存 1 年
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 后端 API 代理
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
    }
}
```

#### **3. Dockerfile**
```dockerfile
# 阶段 1：构建 Angular 应用
FROM node:20.11.0-alpine3.19 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --ignore-scripts
COPY . .
RUN npm run build                        # 输出到 /app/dist/front-project/browser/

# 阶段 2：Nginx 服务
FROM nginx:1.25-alpine3.19
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/front-project/browser /usr/share/nginx/html
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1
EXPOSE 8080
```

### **npm 脚本**
```json
{
  "ng": "ng",              // Angular CLI
  "start": "ng serve",     // 开发服务器
  "build": "ng build",     // 生产构建
  "watch": "ng build --watch --configuration development"
}
```

### **启动命令**
```bash
# 本地开发
cd front-project
npm install
npm start                    # 访问 http://localhost:4200

# Docker 启动
docker-compose up front-project
```

---

## 🐳 Docker Compose 配置

### **网络拓扑**
```
┌─────────────────┐
│  宿主机端口     │
│  8090 (前端)    │
│  8091 (后端)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Docker Network │
│  app-network    │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌──────────┐
│ frontend│ │ backend  │
│ :8080   │ │ :8080    │
└─────────┘ └──────────┘
```

### **服务配置**

#### **1. backend 服务**
```yaml
service: backend
  container_name: spring-backend
  ports:
    - "8091:8080"              # 宿主机 8091 → 容器 8080
  volumes:
    - /Users/a1-6/project/logs:/app/logs    # 日志挂载
    - ~/.m2:/root/.m2                       # Maven 仓库缓存
    - ./backend/src:/app/src                # 源码热更新
  environment:
    - SPRING_PROFILES_ACTIVE=docker
  networks:
    - app-network
```

#### **2. front-project 服务**
```yaml
service: front-project
  container_name: front-frontend
  ports:
    - "8090:8080"              # 宿主机 8090 → 容器 8080
  depends_on:
    - backend
  networks:
    - app-network
```

### **常用命令**
```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f backend
docker-compose logs -f front-project

# 重启单个服务
docker-compose restart backend

# 停止并清理
docker-compose down -v

# 重新构建
docker-compose up -d --build
```

---

## 🔄 数据流和通信

### **前端 → 后端 API 调用流程**

```
用户点击按钮
    ↓
Angular App (app.ts)
    ↓
HTTP GET /api/hello
    ↓
Nginx (default.conf)
    ↓
proxy_pass http://backend:8080/api/
    ↓
Spring Boot HelloController
    ↓
返回 "Hello from Spring Boot!"
    ↓
前端显示消息
```

### **跨域处理**
- ✅ **开发环境：** Nginx 反向代理解决 CORS
- ✅ **生产环境：** 同域名下无需跨域配置

---

## 📝 配置文件清单

| 文件 | 路径 | 作用 | 需要修改 |
|------|------|------|----------|
| `pom.xml` | `backend/pom.xml` | Maven 依赖管理 | ❌ |
| `application.properties` | `backend/src/main/resources/` | Spring Boot 配置 | ⚠️ API Key |
| `package.json` | `front-project/package.json` | npm 依赖管理 | ❌ |
| `angular.json` | `front-project/angular.json` | Angular 构建配置 | ❌ |
| `default.conf` | `front-project/nginx/` | Nginx 反向代理 | ❌ |
| `docker-compose.yml` | `project/` | Docker 编排 | ⚠️ 端口映射 |
| `.dockerignore` | `front-project/` | Docker 忽略文件 | ❌ |

---

## 🚀 部署架构

### **开发环境**
```
宿主机 (localhost)
├── 8090 → front-project:8080 (Nginx)
├── 8091 → backend:8080 (Spring Boot)
└── logs/ → /app/logs (日志挂载)
```

### **生产环境建议**
1. 修改 `docker-compose.yml` 中的端口映射
2. 配置真实域名和 SSL 证书
3. 填写 ZhiPuAI API Key
4. 配置日志轮转和监控
5. 添加环境变量管理敏感信息

---

## 🛠️ 开发指南

### **新增后端接口**
1. 在 `backend/src/main/java/com/example/` 创建新的 Controller
2. 使用 `@RestController` 和 `@RequestMapping` 注解
3. 修改 `application.properties`（如需要）
4. 重启后端服务

### **新增前端页面**
1. 使用 `ng generate component xxx` 生成组件
2. 在 `app.ts` 中导入并使用
3. 修改模板和样式
4. 运行 `npm run build` 重新构建

### **调试技巧**
- **后端日志：** `docker-compose logs -f backend` 或查看 `/Users/a1-6/project/logs/spring.log`
- **前端调试：** 浏览器开发者工具 → Console / Network
- **容器内部：** `docker exec -it spring-backend bash`

---

## ⚠️ 注意事项

1. **API Key 安全：** 不要将 `application.properties` 中的真实 API Key 提交到 Git
2. **端口冲突：** 确保 8090、8091 端口未被占用
3. **日志权限：** 确保 `logs/` 目录有写入权限
4. **Maven 缓存：** 首次构建会下载依赖，后续会使用 `~/.m2` 缓存
5. **健康检查：** 前端容器有 HEALTHCHECK，可通过 `docker ps` 查看状态

---

## 📊 性能优化点

### **已实现**
- ✅ Docker 多阶段构建（减小镜像体积）
- ✅ Nginx 静态资源缓存（1 年）
- ✅ Maven 依赖离线下载
- ✅ npm ci 精确安装依赖
- ✅ .dockerignore 排除不必要文件

### **可优化**
- ⏳ 添加 Redis 缓存（如需）
- ⏳ 配置 CDN（生产环境）
- ⏳ 启用 Gzip 压缩（Nginx）
- ⏳ 数据库连接池（如需数据库）

---

**文档结束**
