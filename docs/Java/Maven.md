### Maven介绍
maven时一款Java项目构建管理、依赖管理的工具，使用 Maven 可以自动化构建、测试、打包和发布项目，提高开发效率和生产质量
### Maven主要作用
1. **依赖管理：**
   Maven 可以管理项目的依赖，包括自动下载所需要的依赖、自动下载依赖需要的依赖并且保证版本没有冲突、依赖管理等，通过 Maven可以方便的维护项目的外部库
2. **构建管理：**
    项目构建之将源代码、配置文件、资源文件等转化为能够运行或部署的应用程序或库的过程
    Maven可以管理项目的编译、测试、打包、部署等构建过程，通过实现标准的构建生命周期，Maven 可以确保每一个构建过程都遵循同样的冠泽和最佳实践。同时 Maven 插件机制也使得开发者可以对构建过程进行扩展和定制。

 ### Maven安装和配置
 1. Maven下载
[maven官网](https://maven.apache.org/)
2. 安装条件：Maven 需要安装Java环境、必须包含JAVA_HOME变量
3. 配置Maven
   
   **环境变量：**配置MAVEN_HOME和PATH 环境变量

4. 命令测试
   ```shell
   mvn -v
   ```
5. 修改配置文件
  - 修改仓库地址
    ```xml
        <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
            <!-- 配置Maven仓库员地址Default:${user.home}/.m2/repository-->   
        <localRepository>~/common_tools/maven_responsity</localRepository>

    ```
  6. 配置阿里Maven镜像
        ```xml
            <mirror>
		  <id>alimaven</id>
		  <name>aliyun maven</name>
		  <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
		  <mirrorOf>central</mirrorOf>        
		</mirror>
		<mirror>
            <id>alimaven</id>
            <mirrorOf>central</mirrorOf>
            <name>aliyun maven</name>
            <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
        </mirror>
        <mirror>
            <id>central</id>
            <name>Maven Repository Switchboard</name>
            <url>http://repo1.maven.org/maven2/</url>
            <mirrorOf>central</mirrorOf>
        </mirror>
        <mirror>
            <id>repo2</id>
            <mirrorOf>central</mirrorOf>
            <name>Human Readable Name for this Mirror.</name>
            <url>http://repo2.maven.org/maven2/</url>
        </mirror>
        <mirror>
            <id>ibiblio</id>
            <mirrorOf>central</mirrorOf>
            <name>Human Readable Name for this Mirror.</name>
            <url>http://mirrors.ibiblio.org/pub/mirrors/maven2/</url>
        </mirror>
        <mirror>
            <id>jboss-public-repository-group</id>
            <mirrorOf>central</mirrorOf>
            <name>JBoss Public Repository Group</name>
            <url>http://repository.jboss.org/nexus/content/groups/public</url>
        </mirror>
        <mirror>
            <id>google-maven-central</id>
            <name>Google Maven Central</name>
            <url>https://maven-central.storage.googleapis.com
            </url>
            <mirrorOf>central</mirrorOf>
        </mirror>
        <!-- 中央仓库在中国的镜像 -->
        <mirror>
            <id>maven.net.cn</id>
            <name>oneof the central mirrors in china</name>
            <url>http://maven.net.cn/content/groups/public/</url>
            <mirrorOf>central</mirrorOf>
		</mirror>
        ```
    