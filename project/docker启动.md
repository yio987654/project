# docker 启动前后端
cd /Users/a1-6/project/project/
# 后台启动（不占终端）,容器继续运行，你可以关闭终端
docker-compose down
docker-compose up -d --build

# 和传统部署区别：对比/Users/a1-6/project/nginx/test1/angular.conf
# 用户访问http://localhost:7777/
# 监听端口改为容器内的 80（因为 Docker 内部默认使用 80，通过端口映射到宿主机 7777）。
# 代理后端地址改为 http://backend:7776/api/（backend 是 docker-compose 中后端服务的名称，容器间通信使用服务名）。
