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
   
   **环境变量：** 配置MAVEN_HOME和PATH 环境变量

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
  -  配置阿里Maven镜像
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
### 依赖传递和冲突
#### 依赖传递
   当引入一个依赖时，Maven 会自动引入依赖的依赖

   依赖传递的作用:

   1. 减少重复依赖：当多个项目依赖同一个库时，Maven 可以自动下载并且只下载一次改库，这样可以减少项目构建时间和磁盘空间
   2. 自动管理依赖：Maven 可以自动管理依赖项，使用以来传递，简化了依赖项的管理，使项目构建更加可靠和一致。
   3. 确保依赖版本正确性：通过依赖传递的依赖之间版本不会存在版本兼容性问题，确保版本以来的正确性。
#### 依赖冲突
 发现已经存在依赖（重复依赖）会终止依赖传递，避免循环依赖和重复依赖的问题
 ##### 依赖冲突解决原则
 1. 第一原则：
谁短谁优先，谁的引用路径短引用谁

    如 A引用B，B引用C C的版本是 1.0

    A - B - C  1.0

    D引用C C的版本是 2.0
    
    D - C      2.0

    则最终引用的C的版本是2.0
 2. 第二原则：谁上谁优先，dependencies声明的先后顺序
   
    A - B   1.0

    C - B   2.0

    最终引用的B的版本是2.0

### 依赖下砸失败问题解决方案
1. 检查网络连接和Maven 仓库服务器状态
2. 确保依赖项的版本号与项目对应的版本一致，检测 POM 文件中依赖项是否正确
3. 清楚本地Maven 仓库缓存（*.lastUpdate文件），只要存在lastUpdate缓存文件，刷新也不会重新下载。本地仓库中根据依赖找到对应的文件夹，最终删除内部文件，舒心重新下载以来即可