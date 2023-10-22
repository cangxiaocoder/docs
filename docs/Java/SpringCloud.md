---
title: SpringCloud
date: 2023-01-19 11:02:00
permalink: /pages/e06998/
categories: 
  - Java
tags: 
  - Spring、SpringBoot、SpringCloud
article: false
author: 
  name: 苍晓
  link: https://github.com/cangxiaocoder
---
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


#### 启动

启动命令(standalone代表着单机模式运行，非集群模式):

```shell
cd /Devlop/nacos/distribution/target/nacos-server-2.2.1-SNAPSHOT/nacos
sh startup.sh -m standalone
```

## OpenFeign

>   Feign是一个声明式客户端，[官方地址：OpenFeign](https://github.com/OpenFeign/feign)，帮我们优雅的做远程调用

### feign使用步骤

1.   引入依赖

     ```xml
     <dependency>
         <groupId>org.springframework.cloud</groupId>
         <artifactId>spring-cloud-starter-openfeign</artifactId>
     </dependency>
     ```

2.   添加注解

     ```java
     @SpringBootApplication
     //@EnableEurekaClient  //Eureka作为注册中心
     @EnableDiscoveryClient //Nacos作为注册中心
     @EnableFeignClients
     public class OrderApplication {
         public static void main(String[] args) {
             SpringApplication.run(OrderApplication.class,args);
         }
     }
     ```

3.   编写FeignClient接口

     ```java
     @FeignClient("user-server")
     public interface UserClient {
         @GetMapping("/user/{id}")
         User findById(@PathVariable("id")long id);
     }
     ```

4.   使用FeginClient远程调用

     ```java
       public Order queryOrder(int id) {
             Order order= orderDao.getOrder(id);
             //使用OpenFeign做远程调用
             User user = this.userClient.getUser(order.getUserId());
             order.setUser(user);
             return order;
         }
     ```

### 自定义Feign配置

#### 配置文件方式

1.   yml配置

     ```yaml
     feign:
       client:
         config:
           default: #这里是default就是全局配置，如果只写服务名，则是针对某个微服务的配置
             logger-level:  full
           user-server: #这里是default就是全局配置，如果只写服务名，则是针对某个微服务的配置
             logger-level:  basic
     ```

2.   日志级别,四个级别

     ```java
     // feign/Logger.java 
     public static enum Level {
             NONE,
             BASIC,
             HEADERS,
             FULL;
             private Level() {
             }
         }
     ```


### Java代码方式   

1.   自定义配置类

     ```java
     public class FeignClientConfiguration {
         @Bean
         public Logger.Level feignLogLevel(){
             return Logger.Level.BASIC;
         }
     }
     ```

     ​	全局配置，将配置放在@EnableFeignClients注解中对所有服务都生效

     ```java
     @SpringBootApplication
     //@EnableEurekaClient  //Eureka作为注册中心
     @EnableDiscoveryClient //Nacos作为注册中心
     @EnableFeignClients(defaultConfiguration = FeignClientConfiguration.class)
     public class OrderApplication {
         public static void main(String[] args) {
             SpringApplication.run(OrderApplication.class,args);
             System.out.println("Hello world!");
         }
     }
     ```

     局部配置，将配置放在FeignCLient注解当中，只对某个服务生效

     ```java
     @FeignClient(value = "user-server", configuration = FeignClientConfiguration.class)
     public interface UserClient {
         @GetMapping("/user/{id}")
         User findById(@PathVariable("id")long id);
     }
     ```


### feign性能优化

>   日志级别订阅为Basic类型或none类型
>
>   使用HttpClient或者OkHttp代替URLConnection

1.   引入HttpClient

     ```xml
             <!--httpClient依赖-->
             <dependency>
                 <groupId>io.github.openfeign</groupId>
                 <artifactId>feign-httpclient</artifactId>
             </dependency>
     ```

2.   htpClient的yml配置

     ```yaml
      feign: 
       httpclient:
         enabled: true #开启feign对httpclient的支持
         max-connections: 200 #最大两家数
         max-connections-per-route: 50  #每个路径最大连接数
     ```

### feign的最佳实践

1.   让controller和FeignClient继承同一个接口
2.   将FeignClient.POJO、Feign的默认配置都定义到一个SDK中，让其他服务引用这个SDK



