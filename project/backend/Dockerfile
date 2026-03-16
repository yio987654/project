# 第一阶段：构建 Java 项目
FROM maven:3.8-openjdk-17 AS build
# 设置容器工作目录
WORKDIR /app
# 先复制 pom.xml，利用缓存加速依赖下载
COPY pom.xml .
# 离线下载所有依赖，避免每次构建都联网
RUN mvn dependency:go-offline
# 复制源码到容器
COPY src ./src
# 编译打包项目，跳过单元测试
RUN mvn clean package -DskipTests

# 第二阶段：运行阶段，使用轻量 JRE 镜像
FROM eclipse-temurin:17-jre
# 设置工作目录
WORKDIR /app
# 定义构建参数，便于动态 jar 名称
ARG JAR_FILE=target/*.jar
# 从构建阶段复制 jar 文件到运行镜像，并统一命名为 app.jar
COPY --from=build /app/${JAR_FILE} app.jar

# 暴露应用端口. server.port=7776决定
EXPOSE 7776

# 启动命令
ENTRYPOINT ["java", "-jar", "app.jar"]