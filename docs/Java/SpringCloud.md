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

     查看环境变量配置

     配置环境变量

     ```shell
     
     ```

2.   执行mvn报错 `permission denied: mvn`

     给mvn命令增加权限

     ```shell
     chmod a+x mvn  # a: 所有用户，x:执行权限ß
     chmod 744 mvn  #给所有用户mvn增加执行权限，7：所有权限 4：执行权限
     ```

     

