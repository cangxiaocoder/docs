---
title: Shell
date: 2022-12-25 17:21:50
permalink: /pages/d81b4d/
categories: 
  - Linux
tags: 
  - shell
article: false
author: 
  name: 苍晓
  link: https://github.com/cangxiaocoder
---
Shell

#### 编辑shell脚本

```sh
echo "hello,world"
```

#### 执行shell

```shell
[root@aliyun scripts]# vim hello.sh
[root@aliyun scripts]# ls
hello.sh
[root@aliyun scripts]# sh hello.sh
hello,world
[root@aliyun scripts]# bash hello.sh
hello,world

```

>   默认回去/bin/、/usr/bin/等目录下面去找这个命令，所以报错找不到命令

```shell

[root@aliyun scripts]# hello.sh
-bash: hello.sh: 未找到命令
```

