微服务姓名结构





## Eureka注册中心

[Spring Cloud Netflix](https://docs.spring.io/spring-cloud-netflix/docs/current/reference/html/)

### Eureka服务端

引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
    <version>3.1.4</version>
</dependency>
```

### Eureka搭建集群

复制一份yml，命名为application-02.yml

##### application-01.yml

```yaml
server:
  port: 8081
spring:
  application:
    name: eureka-server
eureka:
  client:
    service-url:
      defaultZone: http://eureka01:8081/eureka/, http://eureka02:8085/eureka/
    fetch-registry: true
  instance:
    hostname: eureka01
```

#### application-02.yml

```yaml
server:
  port: 8085
spring:
  application:
    name: eureka-server
eureka:
  client:
    service-url:
      defaultZone: http://eureka01:8081/eureka/, http://eureka02:8085/eureka/
    fetch-registry: true
  instance:
    hostname: eureka02
```





### Eureka客户端

引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    <version>3.1.4</version>
</dependency>
```





## LoadBalancer负载均衡



## Nacos注册中心

#### 快速开始

[[Nacos 快速开始](https://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html)]

从GitHub下载源码编译

```shell
git clone https://github.com/alibaba/nacos.git
cd nacos/
mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U  
 
cd distribution/target/nacos-server-$version/nacos/bin
```

#### 异常

1.   执行mvn报错 `command not found：mvn`

     默认安装的 jdk 是没有配置环境变量的，需要配置一下

     配置环境变量

     ```shell
     export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home
     export PATH=$PATH:$JAVA_HOME/bin
     export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
     ```

2.   执行mvn报错 `permission denied: mvn`

     给mvn命令增加权限

     ```shell
     chmod a+x mvn  # a: 所有用户，x:执行权限ß
     chmod 744 mvn  #给所有用户mvn增加执行权限，7：所有权限 4：执行权限
     ```

     

3.   提供者和消费者服务都已经注册到[nacos](https://so.csdn.net/so/search?q=nacos&spm=1001.2101.3001.7020)，将服务者[RestTemplate](https://so.csdn.net/so/search?q=RestTemplate&spm=1001.2101.3001.7020)访问的url也使用服务名替代了，结果调用的时候就报错java.net.UnknownHostException: XXX。

     SpringCloud2020.0.1.0之后版本不使用netflix了，无法使用Ribbon做负载均衡，所以需要手动引入spring-cloud-loadbalancer

     ```xml
             <dependency>
                 <groupId>com.alibaba.cloud</groupId>
                 <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
                 <version>2021.1</version>
             </dependency>
             <dependency>
                 <groupId>com.alibaba.cloud</groupId>
                 <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
                 <version>2021.1</version>
             </dependency>
            <!--SpringCloud2020.0.1.0之后版本不使用netflix了，需要手动引入spring-cloud-loadbalancer-->
             <dependency>
                 <groupId>org.springframework.cloud</groupId>
                 <artifactId>spring-cloud-loadbalancer</artifactId>
             </dependency>
     ```

     
