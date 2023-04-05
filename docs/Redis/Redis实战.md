# Redis实战

## redis分布式锁

### 实现分布式锁的两个基本方法

1.   获取锁,利用setnx的互斥特性确保只有一个现成获取到锁

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

#### 1.1分布式锁简单实现

```java
public class SimpleRedisLock implements ILock{

    private String name;
    private StringRedisTemplate stringRedisTemplate;

    private static final String KEY_PREFIX = "lock:";

    public SimpleRedisLock(String name, StringRedisTemplate stringRedisTemplate) {
        this.name = name;
        this.stringRedisTemplate = stringRedisTemplate;
    }
    /**
     * 加锁
     * @param timeout  超时时间 秒
     */
    @Override
    public boolean tryLock(long timeout) {

        String threadId = String.valueOf(Thread.currentThread().getId());
        //加锁
        Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name, threadId, timeout, TimeUnit.SECONDS);
        //避免自动拆箱空指针异常
        return Boolean.TRUE.equals(success);
    }

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
public class SimpleRedisLock implements ILock{
    private String name;
    private StringRedisTemplate stringRedisTemplate;
    private static final String KEY_PREFIX = "lock:";
    /**
     * 获取锁时存入线程标识
     * 释放锁时需要判断线程标识，一致才释放锁
     */
    private static final String ID_PREFIX = UUID.randomUUID().toString(true)+"-";
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
        String ThreadId = ID_PREFIX + Thread.currentThread().getId();
            //加锁
        Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name, ThreadId, timeout, TimeUnit.SECONDS);
        //避免自动拆箱空指针异常
        return Boolean.TRUE.equals(success);
    }
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

#### Redis的Lua脚本

Redis提供了Lua脚本功能，在一个脚本中编写多条Redis命令，确保多条命令执行时的原子性

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

举例使用 ==KEYS和ARGV必须大写==

```shell
127.0.0.1:6379> EVAL "return redis.call('set','name','jack')" 0
OK
127.0.0.1:6379> get name
"jack"
127.0.0.1:6379> EVAL "return redis.call('set',KEYS[1], ARGV[1])"  1 name rose
OK
127.0.0.1:6379> get name
"rose"
```

#### 1.3基于Lua脚本的分布式锁

释放锁流程：

1.   获取锁中的线程标识
2.   判断是否与指定的线程标识相同
3.   如果一致则释放锁
4.   如果不一致则什么都不做



