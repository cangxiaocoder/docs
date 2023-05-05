---
title: Redis实战
date: 2023-03-19 22:28:18
permalink: /pages/e4e8ac/
categories: 
  - Redis
tags: 
  - 数据库
author: 
  name: 苍晓
  link: https://github.com/cangxiaocoder
---
## redis分布式锁

### 一个分布式锁具备的条件

-   独占性：任何时刻有且只能有一个线程持有锁
-   高可用：Redis集群环境下，不能因为一个节点挂了而出现获取锁或释放锁失败；高并发情况下，依旧保持良好的性能
-   防死锁：必须有超时控制机制或撤销的操作，有个兜底终止的方案，防止死锁
-   不乱抢：不能释放别的线程加的锁，只能释放自己加的锁
-   可重入：通一个节点的同一个线程获得锁之后可以再次获取这个锁，

### 实现分布式锁的两个基本方法

1.   获取锁,利用setnx的互斥特性确保只有一个线程获取到锁

     ```shell
     127.0.0.1:6379> setnx lock thread1
     (integer) 1
     #只能有一个现成获取到锁
     127.0.0.1:6379> setnx lock thread1
     (integer) 0
     ```

2.   释放锁

     ```shell
     #添加过期时间	，避免服务宕机造成死锁
     127.0.0.1:6379> expire lock 10
     (integer) 1
     #手动释放锁
     127.0.0.1:6379> del lock
     (integer) 1
     ```

#### 保证命令的原子性

-   避免刚设置完锁Redis宕机造成死锁

    nx：是互斥，必须不存在才能设置成功，

    ex：设置过期时间

    ```shell
    set lock thread1 nx ex 10
    ```


### Redis分布式锁实现

#### 1.1分布式锁实现

```java
public class SimpleRedisLock implements ILock{
    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleRedisLock.class);
    private String name;
    private StringRedisTemplate stringRedisTemplate;
    private static final String KEY_PREFIX = "redisLock:";
    private static final String ID_PREFIX = IdUtil.simpleUUID();
    /**
     * @param name key后缀
     * @param stringRedisTemplate StringRedisTemplate
     */
    public SimpleRedisLock(String name, StringRedisTemplate stringRedisTemplate) {
        this.name = name;
        this.stringRedisTemplate = stringRedisTemplate;
    }
    /**
     * 加锁
     * @param timeout  超时时间 秒
     * @return
     */
    @Override
    public boolean tryLock(long timeout) {

        String threadId = String.valueOf(Thread.currentThread().getId());
        //加锁
        Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name, ID_PREFIX+threadId, timeout, TimeUnit.SECONDS);
        while (Boolean.FALSE.equals(success)){
            //获取锁失败,暂停20ms 递归获取锁直到成功
            try {
                TimeUnit.MILLISECONDS.sleep(20);
            } catch (InterruptedException e) {
                LOGGER.debug(e.getMessage());
            }
            success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name, ID_PREFIX+threadId, timeout, TimeUnit.SECONDS);
        }
        //避免自动拆箱空指针异常
        return true;
    }
    /**
     * 没有判断是谁加的锁，会导致解错锁，如Thread2解了Thread1的锁
     */
    @Override
    public void unLock() {
        stringRedisTemplate.delete(KEY_PREFIX+name);
    }
}
```

##### 问题：锁误删

1.   现成Thread-1加锁成功，执行任务超过超时时间仍未处理完成，Redis锁超过超时时间自动释放
2.   此时Thread-2尝试加锁成功，正在处理任务，然后线程1执行任务完成后释放Redis锁
3.   Thread-3进入尝试加锁，由于Thread-2加的锁被Therad-1误删，所以Thread-3会枷锁成功

#### 1.2分布式锁实现

>   加锁时加入线程ID标识，释放锁时先判断是否为当前加锁的线程，然后再释放锁，解决锁误删问题

```java
public class SimpleRedisLock2 implements ILock{
    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleRedisLock2.class);
    private String name;
    private StringRedisTemplate stringRedisTemplate;
    private static final String KEY_PREFIX = "redisLock:";
    private static final String ID_PREFIX = IdUtil.simpleUUID();
    /**
     * @param name key后缀
     * @param stringRedisTemplate StringRedisTemplate
     */
    public SimpleRedisLock2(String name, StringRedisTemplate stringRedisTemplate) {
        this.name = name;
        this.stringRedisTemplate = stringRedisTemplate;
    }
    /**
     * 加锁
     * @param timeout  超时时间 秒
     * @return
     */
    @Override
    public boolean tryLock(long timeout) {
        String threadId = String.valueOf(Thread.currentThread().getId());
        //加锁
        Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name, ID_PREFIX+threadId, timeout, TimeUnit.SECONDS);
        while (Boolean.FALSE.equals(success)){
            //获取锁失败,暂停20ms 递归获取锁直到成功
            try {
                TimeUnit.MILLISECONDS.sleep(20);
            } catch (InterruptedException e) {
                LOGGER.debug(e.getMessage());
            }
            success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name, ID_PREFIX+threadId, timeout, TimeUnit.SECONDS);
        }
        //避免自动拆箱空指针异常
        return true;
    }
    /**
     * 释放锁是非原子操作
     */
    @Override
    public void unLock() {
        //获取线程标识
        String threadId = ID_PREFIX + Thread.currentThread().getId();
        //判断线程标识是否一致，一致才释放锁
        if (threadId.equals(stringRedisTemplate.opsForValue().get(KEY_PREFIX+name))){
            stringRedisTemplate.delete(KEY_PREFIX+name);
        }

    }
}
```

##### 问题：非原子操作释放锁导致锁误删

1.   现成Thread-1加锁成功，任务执行完成开始释放Redis锁，由于释放锁需要先判断再释放是一个非原子性操作，在判断完成之后可能会出现阻塞
2.   当超过超时时间之后锁自动释放，Thread-2尝试加锁成功，正在处理任务，然后线程1阻塞完成继续释放锁，但此时锁是Thread-2的锁
3.   Thread-3进入尝试加锁，由于Thread-2加的锁被Therad-1误删，所以Thread-3会枷锁成功，非原子性操作导致锁误删

#### 1.3基于Lua脚本分布式锁

```java
public class LuaRedisLock implements ILock{
    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleRedisLock.class);
    /**
     * 初始化释放锁脚本，避免释放锁时再初始化，提升性能
     */
    private static final DefaultRedisScript<Long> UNLOCK_SCRIPT;
    static {
        UNLOCK_SCRIPT = new DefaultRedisScript<>();
        UNLOCK_SCRIPT.setLocation(new ClassPathResource("unlock.lua"));
        UNLOCK_SCRIPT.setResultType(Long.TYPE);
    }
    private String name;
    private StringRedisTemplate stringRedisTemplate;
    private static final String KEY_PREFIX = "redisLock:";
    private static final String ID_PREFIX = IdUtil.simpleUUID();
    /**
     * @param name key后缀
     * @param stringRedisTemplate StringRedisTemplate
     */
    public LuaRedisLock(String name, StringRedisTemplate stringRedisTemplate) {
        this.name = name;
        this.stringRedisTemplate = stringRedisTemplate;
    }
    /**
     * 加锁 不支持重入，没获取锁的线程应该进入等待队列
     * @param timeout  超时时间 秒
     * @return
     */
    @Override
    public boolean tryLock(long timeout) {
        String threadId = String.valueOf(Thread.currentThread().getId());
        //加锁
        Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name, ID_PREFIX+threadId, timeout, TimeUnit.SECONDS);
        while (Boolean.FALSE.equals(success)){
            //获取锁失败,暂停20ms 递归获取锁直到成功
            try {
                TimeUnit.MILLISECONDS.sleep(20);
            } catch (InterruptedException e) {
                LOGGER.debug(e.getMessage());
            }
            success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name, ID_PREFIX+threadId, timeout, TimeUnit.SECONDS);
        }
        //避免自动拆箱空指针异常
        return true;
    }
    /**
     * 调用lua叫本保证Redis命令执行的原子性
     */
    @Override
    public void unLock() {
        stringRedisTemplate.execute(UNLOCK_SCRIPT,
                Collections.singletonList(KEY_PREFIX+name),
                ID_PREFIX + Thread.currentThread().getId());

    }
}
```

##### Redis的Lua脚本

Redis提供了Lua脚本功能，在一个脚本中编写多条Redis命令，<mark>确保多条命令执行时的原子性</mark>

执行`redis.call('set','name','jack')"`这个脚本，语法：

```lua
EVAL "return redis.call('set','name','jack')" 0
-- return redis.call('set','name','jack') 脚本内容
-- 0 脚本需要的key类型的参数个数
```

>   key value可以作为参数传递，key类型参数狐疑放入KEYS数组，其它参数会放入ARGV数组，在脚本中可以从KEYS和ARGV中获取

```lua
EVAL "return redis.call('set',KEYS[1], ARGV[1])"  1 name rose
```

举例使用 <mark>KEYS和ARGV必须大写</mark>

```shell
127.0.0.1:6379> EVAL "return redis.call('set','name','jack')" 0
OK
127.0.0.1:6379> get name
"jack"
127.0.0.1:6379> EVAL "return redis.call('set',KEYS[1], ARGV[1])"  1 name rose
OK
127.0.0.1:6379> get name
"rose"
127.0.0.1:6379> eval "return redis.call('mset', KEYS[1],ARGV[1], KEYS[2],ARGV[2])" 2  k1 k2 v1 v2
OK
127.0.0.1:6379> get k1
"v1"
127.0.0.1:6379> get k2
"v2"
```

##### 释放锁流程：

1.   获取锁中的线程标识
2.   判断是否与指定的线程标识相同
3.   如果一致则释放锁
4.   如果不一致则什么都不做

```lua
--获取线程标识 redis.call('get',KEYS[1]). 每个条件分支之后都要有then，除了else
if (redis.call('get',KEYS[1]) = ARGV[1]) 
--相同释放锁，返回 1
    return redis.call('del', KEYS[1])
else
-- 不一致直接返回
    return 0
end
```

##### 问题：不支持重入

1.   锁不支持重入，同一个线程再次加锁需要等待上次锁释放

#### 1.4 可重入锁

1.   使用`hset`命令代替`set`命令实现可重入锁
2.   `ESIXTS key` 判断key是否存在

```shell
127.0.0.1:6379> hset redisLock thread-01 1 # 第一次加锁
(integer) 1
127.0.0.1:6379> hget redisLock thread-01  # 获取加锁次数
"1"
127.0.0.1:6379> hincrby redisLock thread-01 1  #再次获取一次锁，重入锁
(integer) 2
127.0.0.1:6379> hincrby redisLock thread-01 1 #再次获取一次锁，重入锁
(integer) 3
127.0.0.1:6379> hget redisLock thread-01
"3"
127.0.0.1:6379> exists redisLock  #判断锁是否存在
(integer) 1
127.0.0.1:6379> exists redisLock thread-01 #判断是否是当前线程加的锁
(integer) 1
127.0.0.1:6379> del redisLock
(integer) 1
127.0.0.1:6379> exists redisLock
(integer) 0
```

##### 可重入锁实现

```java
public class RedisDistributedLock implements Lock {

    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleRedisLock.class);
    private static final String redisLock = "if (redis.call('exists',KEYS[1]) == 0 or redis.call('hexists',KEYS[1], ARGV[1]) == 1) then" +
            "       redis.call('hincrby', KEYS[1], ARGV[1], 1)" +
            "       redis.call('expire', KEYS[1], ARGV[2])" +
            "       return 1" +
            "   else" +
            "       return 0" +
            "   end";
   private static final String unRedisLock = "if (redis.call('hexists',KEYS[1], ARGV[1]) == 0) then" +
            "       return nil;" +
            "   elseif (redis.call('hincrby', KEYS[1], ARGV[1], -1)==0) then" +
            "        return redis.call('del', KEYS[1])" +
            "   else" +
            "        return 0" +
            "   end";
    private static final DefaultRedisScript<Long> UNLOCK_SCRIPT = new DefaultRedisScript<>(unRedisLock, Long.class);
    private static final DefaultRedisScript<Boolean> LOCK_SCRIPT = new DefaultRedisScript<>(redisLock, Boolean.class);
    private StringRedisTemplate stringRedisTemplate;
    private String lockName;
    private String uuidValue;
    private long expireTime;

    public RedisDistributedLock(StringRedisTemplate stringRedisTemplate, String lockName) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.lockName = lockName;
        this.uuidValue = IdUtil.simpleUUID();
        this.expireTime = 60L;
        System.out.println("uuidValue = " + uuidValue);
    }
    @Override
    public void lock() {
        Boolean value = stringRedisTemplate.execute(LOCK_SCRIPT,
                Collections.singletonList(lockName),
                uuidValue, String.valueOf(expireTime));
        System.out.println("value = " + value);
        if (Boolean.TRUE.equals(value)) return;

        while (!tryLock()) {
            try {
                TimeUnit.MILLISECONDS.sleep(60);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
    @Override
    public void lockInterruptibly() throws InterruptedException {

    }
    @Override
    public boolean tryLock() {
        Boolean value = stringRedisTemplate.execute(LOCK_SCRIPT,
                Collections.singletonList(lockName),
                uuidValue, String.valueOf(expireTime));
        
        return Boolean.TRUE.equals(value);
    }
    @Override
    public boolean tryLock(long time, TimeUnit unit){
        LOGGER.debug("加锁uuidValue:{}", uuidValue);
        if (time == -1) {
            //加锁
            Boolean value = stringRedisTemplate.execute(LOCK_SCRIPT,
                    Collections.singletonList(lockName),
                    uuidValue, String.valueOf(expireTime));

            return Boolean.TRUE.equals(value);
        }
        if (time <= 0) return false;

        long secondsTimeout = unit.toSeconds(time);
        final long deadline = System.nanoTime() + secondsTimeout;
        for (; ; ) {
            if (tryLock()) {
                return true;
            }
            secondsTimeout = deadline - System.nanoTime();
            if (secondsTimeout <= 0L){
                return false;
            }
        }

    }
    @Override
    public void unlock() {
        Long value = stringRedisTemplate.execute(UNLOCK_SCRIPT,
                Collections.singletonList(lockName),
                uuidValue);
        if (value == null) {
            throw new RuntimeException("this lock doesn't exists");
        }

    }
    @Override
    public Condition newCondition() {
        return null;
    }
}
```

##### redisLock.lua

```lua
--[[--判断是否存在锁
if (redis.call('exists',KEYS[1]) == 1) then
    -- 判断加锁的线程是否是当前线程
    if (redis.call('hexists',KEYS[1], KEYS[2]) == 1) then
        -- 若是：锁重入次数 +1 重新设置超时时间
        redis.call('hincrby', KEYS[1], KEYS[2], 1)
        redis.call('expire', KEYS[1], ARGV[1])
        return 1
    else
    -- 其他线程来获取锁，获取失败
        return 0
end
else
-- 锁不存在 创建锁
    redis.call('hincrby', KEYS[1],KEYS[2], 1)
    redis.call('expire', KEYS[1], ARGV[1])
return 1
end]]

--精简 判断是否存在锁
-- 锁不存在直接创建，所存在并且是当前线程则增加锁重入次数，并重新设置超时时间
if (redis.call('exists',KEYS[1]) == 0 or redis.call('hexists',KEYS[1], ARGV[1]) == 1) then
    -- 判断加锁的线程是否是当前线程
    redis.call('hincrby', KEYS[1], ARGV[1], 1)
    redis.call('expire', KEYS[1], ARGV[2])
    return 1
else
    return 0
end
```

##### unRedisLock.lua

```lua
--判断是否存在锁
--[[if (redis.call('exists',KEYS[1]) == 1) then
    -- 判断加锁的线程是否是当前线程
    if (redis.call('hexists',KEYS[1], KEYS[2]) == 1) then
        -- 若是：锁重入次数 +1 重新设置超时时间
        redis.call('hincrby', KEYS[1], KEYS[2], -1)
        --redis.call('expire', KEYS[1], ARGV[1])
        return 1
    end
else
    return 0
end]]


-- 判断当前 线程是否加锁，如果没加锁返回 -1
if (redis.call('hexists',KEYS[1], ARGV[1]) == 0) then
    -- 若是：锁重入次数 -1
    return nil;
    -- 如果加了锁，则将所重入此时-1，若 -1 之后重入次数为0则删除这个锁
elseif (redis.call('hincrby', KEYS[1], ARGV[1], -1)==0) then
    return redis.call('del', KEYS[1])
else
    return 0
end

--if (redis.call('hexists',KEYS[1], ARGV[1]) == 0) then
--    -- 若是：锁重入次数 -1
--    return -1
--    -- 如果加了锁，则将所重入此时-1，若 -1 之后重入次数为0则删除这个锁
--else
--    local a = redis.call('hincrby', KEYS[1], ARGV[1], -1)
--    if (a==0) then
--        redis.call('del', KEYS[1])
--        return 1
--    else
--        return 0
--    end
--end
```

#### 1.5自动续期

##### RedisDistributedLock

```java
public class RedisDistributedLock implements Lock {
        private static final Logger LOGGER = LoggerFactory.getLogger(SimpleRedisLock.class);
        private static final String redisLock = "if (redis.call('exists',KEYS[1]) == 0 or redis.call('hexists',KEYS[1], ARGV[1]) == 1) then" +
                "       redis.call('hincrby', KEYS[1], ARGV[1], 1)" +
                "       redis.call('expire', KEYS[1], ARGV[2])" +
                "       return 1" +
                "   else" +
                "       return 0" +
                "   end";
       private static final String unRedisLock = "if (redis.call('hexists',KEYS[1], ARGV[1]) == 0) then" +
                "       return nil;" +
                "   elseif (redis.call('hincrby', KEYS[1], ARGV[1], -1)==0) then" +
                "        return redis.call('del', KEYS[1])" +
                "   else" +
                "        return 0" +
                "   end";
        private static final String renewal = "if (redis.call('hexists',KEYS[1],ARGV[1]) == 1) then" +
                "       return redis.call('expire', KEYS[1],ARGV[2])" +
                "   else" +
                "       return 0" +
                "   end";
        private static final DefaultRedisScript<Long> UNLOCK_SCRIPT = new DefaultRedisScript<>(unRedisLock, Long.class);
        private static final DefaultRedisScript<Boolean> LOCK_SCRIPT = new DefaultRedisScript<>(redisLock, Boolean.class);
        private static final DefaultRedisScript<Boolean> RENEW_SCRIPT = new DefaultRedisScript<>(renewal, Boolean.class);

        private StringRedisTemplate stringRedisTemplate;
        private String lockName;
        private String uuidValue;
        private long expireTime;

        public RedisDistributedLock(StringRedisTemplate stringRedisTemplate, String lockName, String uuid) {
            this.stringRedisTemplate = stringRedisTemplate;
            this.lockName = lockName;
            this.uuidValue = uuid+Thread.currentThread().getId();
            this.expireTime = 30L;
        }
        @Override
        public void lock() {
            LOGGER.debug("lock lockName:{}, uuidValue:{}", lockName, uuidValue);
            Boolean value = stringRedisTemplate.execute(LOCK_SCRIPT,
                    Collections.singletonList(lockName),
                    uuidValue, String.valueOf(expireTime));
            if (Boolean.TRUE.equals(value)) {
                renewExpire();
                return;
            }
            while (!tryLock()){
                try {
                    TimeUnit.MILLISECONDS.sleep(100);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
            renewExpire();
        }
        private void renewExpire(){
            new Timer("renewExpire", true).schedule(new TimerTask() {
                @Override
                public void run() {
                    Boolean result = stringRedisTemplate.execute(RENEW_SCRIPT,
                            Collections.singletonList(lockName),
                            uuidValue, String.valueOf(expireTime));
                    //循环更新超时时间
                    if (Boolean.TRUE.equals(result)) {
                        System.out.println("自动续期");
                        renewExpire();
                    }
                }
            },(this.expireTime * 1000) / 3);
        }
        @Override
        public boolean tryLock() {
            Boolean value = stringRedisTemplate.execute(LOCK_SCRIPT,
                    Collections.singletonList(lockName),
                    uuidValue, String.valueOf(expireTime));
            return Boolean.TRUE.equals(value);
        }

        @Override
        public boolean tryLock(long time, TimeUnit unit){
            if (time == -1) {
                //加锁
                Boolean value = stringRedisTemplate.execute(LOCK_SCRIPT,
                        Collections.singletonList(lockName),
                        uuidValue, String.valueOf(expireTime));

                return Boolean.TRUE.equals(value);
            }
            if (time <= 0) return false;

            long secondsTimeout = unit.toSeconds(time);
            final long deadline = System.nanoTime() + secondsTimeout;
            for (; ; ) {
                if (tryLock()) {
                    return true;
                }
                secondsTimeout = deadline - System.nanoTime();
                if (secondsTimeout <= 0L){
                    return false;
                }
            }
        }
        @Override
        public void unlock() {
            Long value = stringRedisTemplate.execute(UNLOCK_SCRIPT,
                    Collections.singletonList(lockName),
                    uuidValue);
            LOGGER.debug("unlock:lockName:{},uuidValue:{}", uuidValue,lockName);
            if (value == null) {
                throw new RuntimeException("this lock doesn't exists");
            }

        }
        @Override
        public void lockInterruptibly() throws InterruptedException {}
        @Override
        public Condition newCondition() {
            return null;
        }
    }
```



