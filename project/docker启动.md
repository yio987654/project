# 转移到[docker-compose.yml](docker-compose.yml)所在目录
cd /Users/a1-6/project/project/
# docker 关闭容器
docker-compose down 
# docker 一步式启动前后端（最慢，需要下载所有依赖）
docker-compose up -d --build
# or
docker-compose up -d --build front-project  # 只构建前端
docker-compose up -d --build backend        # 只构建后端
# 使用已有的镜像，秒启动
docker-compose up -d

# 和传统部署区别可对比如下：
/Users/a1-6/project/nginx/test1/angular.conf

# 用户访问
http://localhost:8765/

# 代理后端地址
 http://backend:8080/api/（backend 是 docker-compose 中后端服务的名称，容器间通信使用服务名）。

# docker-compose 的作用
docker-compose 是一个用来定义和运行多个 Docker 容器的工具。你可以在一个 docker-compose.yml 文件里同时定义前端服务（frontend）和后端服务（backend），然后通过一条命令 docker-compose up 把它们一起启动。

每个服务运行在自己的容器中，拥有独立的文件系统、进程空间和网络命名空间。

Docker Compose 会自动创建一个默认的网络（例如 app-network），并将所有服务加入这个网络，这样它们就可以通过服务名互相访问（例如前端容器里可以通过 http://backend:8080 访问后端）。