---
title: Java中的锁
author: 苍晓
date: 2023-03-13
permalink: /pages/fdae73/
categories: 
  - Java
tags: 
  - 
---
## synchronize锁

### 锁状态

引入偏向锁和轻量级锁时基于这样的判断L：尽管需要对存在线程安全的代码加锁，但实际上，出现同一时刻多个线程竞争锁的概率很小，甚至在大多数情况下都只被一个线程使用，

对于一个synchronize锁，如果它只有一个线程使用，那么synchronize底层就使用偏向锁实现，如果它被多个线程交叉使用，不存在竞争的情况，那么synchronize底层就使用轻量级锁实现，如果存在竞争使用的情况，那么synchronize底层就使用重量级锁实现

锁的实现需要使用对象头的Mark Word（标记字）,它主要用来表示对象的线程锁状态，另外还可以用来配合GC、存放该对象的hashCode，MarkWord是可变字段，在不同的情况下存储不同的内容

![image-20230328220751986](./assets/MarkWord.png)



### 偏向锁

当一个对象刚被创建时，MarkWord是无锁状态，并随即很快会变成偏向锁状态，可以设置JVM参数 `--XX:BiasedLockingStartupDelay=0`,那么MarkWorld在对象创建后直接进入偏向锁状态MarkWord中threadID为0，意思是还没有线程获得锁，

如果某个线程在某个对象上使用了synchronize关键字，发现这个对象的MarkWord处于偏向锁状态，并且threadID为0，那么就会通过CAS操作来竞争这个偏向锁：先判断MarkWord的偏向模式的值为1（1：代表偏向锁模式），然后将threadID 设为当前线程ID，获取偏向锁成功，按照前面的假设，偏向锁只有一个线程在使用，那么CAS操作一定可以获取到锁，线程获取到锁后就可以继续执行业务代码，执行完成后偏向锁并不会释放锁，这是偏向锁区别于轻量级锁和重量级锁的一个特点，这样的目的是为了提高加锁效率，因为只有一个线程来获取锁，那么当同一个线程再次竞争这个偏向锁时，线程发现MarkWord处于偏向锁状态并且threadID正好是自己的线程ID，那么线程就不需要做任何的加锁操作就直接可以执行业务代码了，

而CAS操作使用的是硬件层面上提供的CPU指令，本质上是对总线加锁，这种操作执行效率比较低，所以减少CAS操作会大大提高加锁的性能，这也是偏向锁相对于偏向锁更加高性能的原因。轻量级锁的实现需要大量的CAS操作，而偏向锁只有在第一次竞争锁的时候使用一次CAS操作，之后再次加锁都不需要使用CAS操作了。



### 轻量级锁

如果有两个线程竞争偏向锁，可以分两种情况，第一种情况：两个线程同时竞争偏向锁，其中一个竞争成功，另外一个竞争失败，第二种情况，已经有一个线程获取了偏向锁，这个时候又有一个线程来获取偏向锁，这两种情况都已经不符合偏向锁的使用场景了，这个时候竞争偏向锁的线程就会将偏向锁升级为轻量级锁，

### 重量级锁
```C++
  class ObjectMonitor{
    void *volatile _object;  // 改Monitor锁所属的对象
    void *volatile _owner;  // 获取到该Monitor锁的线程
    ObjectWatier *volatile _cxq;  // 没有获取到锁的线程暂时加入_cxq队列
    ObjectWatier *volatile _EntryList;  // 存储等待被唤醒的线程
    ObjectWatier *volatile _WaitSet; // 存储调用了wait()的线程
  }
```

## Lock锁

### Lock相对于synchronize的优势


#### 可重入锁
 可重入锁是指一个线程可以多次获取锁，在Lock中有state属性保存了锁的加错次数
#### 可中断锁
  对于公平锁来说，线程会按照请求的顺序来获取锁，而非公平锁无法保证线程获取锁的先后顺序，每次获取锁都需要重新竞争，synchronize只支持非公平锁，JUC中ReentrantLock及支持非公平锁也支持公平锁。ReentrantLock使用AQS来存储排队的线程。
#### 公平锁
对于synchronize锁来说，线程阻塞等待synchronize锁时是无法响应中断的，而JUC中Lock接口提供了lockInterruptibly()函数，支持可响应中断的获取锁。
#### 非阻塞锁
对于synchronize锁来说，一个线程去请求一个synchronize锁时，如果锁已经被其它线程持有，那么线程就需要阻塞等待，JUC中Lock接口提供库tryLock()函数，支持非阻塞的方式获取锁，如果锁已经被其他线程获取，那么调用tryLock()函数会立刻返回而不是阻塞等待。
#### 可超时锁
JUC Lock接口除了提供不带参数的tryLock()函数外还提供了带超时时间的tryLock()函数，支持非阻塞的获取锁的同时还可以设置超时时间，如果一个线程在请求锁时，这个锁被其他线程持有了，它会等待设定的超时时间，如果依然没有获取到锁则不再等待直接返回，