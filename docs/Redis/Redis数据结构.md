
## SDS

### SDS与C字符串的区别

##### SDS字符串结构：

```c
struct __attribute__ ((__packed__)) sdshdr8 {
    uint8_t len; /* 字符串长度 */
    uint8_t alloc; /* 分配的空间长度 */
    unsigned char flags; /* SDS类型 */
    char buf[]; /* 字节数组 */
};
```

如下图redis中字符串数组结构

![SDS结构](./assets/SDS_struct.png)

##### O(1)复杂度获取字符串长度

> len记录了字符串长度

在redis中**len记录了字符串长度**。获取字符串长度的时候只需要返回len的值就可以，时间复杂度为 O(1)。

C 语言的字符串底层是一个字符数组，与Java字符串类似。如下图`char* str = redis`字符串数组结构：

![redis](./assets/redis.png)

在 C 语言里，char * 指针只是指向字符数组的起始位置，而数组末尾用“\0”表示字符串结束的位置。因此，C字符串并不能记录自身的长度，为了获取字符串的长度需要遍历整个字符串，直到遇到空白字符“\0”为止，这个操作的复杂度为O(N)。所以字符串中不能含有“\0”字符，否则会被认为是字符串的结尾，这也导致C语言字符串只能保存文本数据，而不能保存图片、音频、视频等二进制数据。

##### 避免缓冲区溢出

 C 语言标准库中字符串的操作函数是很不安全的，对程序员很不友好，稍微一不注意，就会导致缓冲区溢出。

举个例子，strcat 函数是可以将两个字符串拼接在一起

```c
//将 src 字符串拼接到 dest 字符串后面
char *strcat(char *dest, const char* src);
```

在执行这个strcat函数时，如果没有分配足够多的内存可以容纳拼接后的字符串内容，就会产生缓冲区溢出；而且由于没有记录字符串长度，在操作字符串时都要遍历字符串的长度才能操作，**对字符串的操作效率不高**，

与C字符串不同，Redis 中空间分配策略完全杜绝了发生缓冲区溢出的可能， SDS 结构里引入了 alloc 和 len 成员变量，当 SDS API 需要对SDS进行修改时，会先通过 `alloc - len` 计算来检查SDS空间是否满足要求，**当判断出缓冲区大小不够用时，Redis 会自动将扩大 SDS 的空间大小**，然后才执行实际修改操作。

SDS 扩容的规则：

```c
hisds hi_sdsMakeRoomFor(hisds s, size_t addlen) {
    void *sh, *newsh;
    /* 返回SDS中未使用的空间字符数 */
    size_t avail = hi_sdsavail(s);
    size_t len, newlen;
    char type, oldtype = s[-1] & HI_SDS_TYPE_MASK;
    int hdrlen;

    /* 若的剩余空间已足够，无需扩展，直接返回. */
    if (avail >= addlen) return s;

    len = hi_sdslen(s);
    sh = (char*)s-hi_sdsHdrSize(oldtype);
    newlen = (len+addlen);
    if (newlen < HI_SDS_MAX_PREALLOC)
        /* 新长度小于HI_SDS_MAX_PREALLOC，则分配两倍的空间 HI_SDS_MAX_PREALLOC = 1024*1024 = 1M*/
        newlen *= 2;
    else
        newlen += HI_SDS_MAX_PREALLOC;

    type = hi_sdsReqType(newlen);

    /* Don't use type 5: 不要使用类型 HI_SDS_TYPE_5*/
    if (type == HI_SDS_TYPE_5) type = HI_SDS_TYPE_8;

    ···
    /* newlen被赋值给alloc*/
    hi_sdssetalloc(s, newlen);
    return s;
}
```

##### 减少内存重分配

由于C字符串长度和底层数组之间存在着关联性，所以每次增长或缩短一个以字符串都要对这个数组做一次内存重分配

- 如果是增长字符串，如字符串拼接，需要先扩展数组空间，否则会产生缓冲区溢出
- 如果是缩短字符串，如字符串截断，需要选释放空间，否则就会产生内存泄漏

而SDS则使用一个len属性来记录字符串的长度，底层数组的长度不一定就是字符串的数量加一（包含结束符\0），通过未使用空间，SDS实现了空间预分配和惰性释放空间

空间预分配：

1. **如果修改SDS字符串后，字符串的长度小于1MB，那么程序会分配2*len+1的空间**（包含结束符\0）
2. **如果修改SDS字符串后，字符串的长度大于1MB，那么程序会多分配1MB的未使用空间**

通过空间预分配策略，Redis会减少执行字符串增长时的内存重分配次数；

如图当SDS执行`sdscat(s,”cluster”)`,SDS 将执行一次空间预分配策略，SDS的长度修改为12字节，预分配空间长度为24字节，当再次调用`sdscat(s,”tutorial”)`时，由于剩余空间`alloc - len`的长度足够新增字符串使用，Redis会直接使用未使用空间而无需执行内存重分配

![内存预分配](./assets/pre_memory.png)

惰性释放空间:

当SDS需要缩短字符串时，Redis不会立即执行内存重分配来回收空间，而是修改len属性的长度，剩余空间用来以后增长字符串时使用。

##### 二进制安全

C语言字符串中的字符必须符合编码规范并且不能出现空字符\0，而SDS不需要用 “\0” 字符来标识字符串结尾，而是用一个专门的len成员变量来记录数组长度，所以可存储包含 “\0” 的数据。但是 SDS 为了兼容部分 C 语言标准库的函数， SDS 字符串结尾还是会加上 “\0” 字符。

SDS的API都是二进制安全的，所有SDS API都会以处理二进制的方式来处理SDS存放在buf[]数组中的数据，程序不会对其中的数据做任何限制，数据写入的时候时什么样的，它被读取时就是什么样的，因此Redis 不仅可以保存文本数据，也可以保存任意格式的二进制数据。

## 链表

### 链表结构

### 链表节点

```c
typedef struct listNode {
    struct listNode *prev;
    struct listNode *next;
    void *value;
} listNode;

```

节点之间通过前置指针(prev)和后置指针相连接(next)，组成一个双向链表

![image-20221122224632036](./assets/listNode.png)

##### 链表

```c
typedef struct list {
    listNode *head; // 头结点
    listNode *tail; // 尾节点
    void *(*dup)(void *ptr); //节点值复制函数
    void (*free)(void *ptr); //节点值释放函数
    int (*match)(void *ptr, void *key); //节点值比较函数
    unsigned long len; //链表节点数量
} list;
```

list链表结构包含了头指针head、为指针tail、链表节点数量len、以及dup、free、match三个链表操作的函数

![image-20221122225156515](./assets/list.png)

### 链表的特点

- 双端： 链表节点里带有 prev 和 next 指针，获取某个节点的前置节点或后置节点的时间复杂度只需O(1)；
- 无环：表头节点的 prev指针和表尾节点的 next 指针都指向null；
- 带表头表尾指针：list 结构中包含 head 指针 head 和 tail 指针，获取链表的表头节点和表尾节点的时间复杂度都是O(1)；
- 带链表长度计数器：List结构中用一个len属性来统计链表节点的数量，获取链表节点数量的复杂度是O(1)；
- 多种类型：listNode 链表节使用 void* 指针保存节点值，并且可以通过 list 结构的 dup、free、match 函数指针为节点设置该节点类型特定的函数，所以链表节点可以保存各种不同类型的值；

缺陷：

- 链表每个节点通过前后指针相连，**内存不连续，无法利用 CPU 的缓存**。
- 保存一个链表节点的值需要分配一个链表节点的空间，**内存开销较大**。

Redis 3.2 版本之前，Redis采用ZipList和LinkedList来实现List，当数据量较少的情况下会使用ZipList作为底层实现，可以节省空间，数据较多时采用LinkedList作为底层实现。

Redis 3.2 版本之后，Redis设计了一个新的数据结构quickList，并统一采用quickList来实现List。

## 压缩列表

ZipList是一种特殊的“双端链表”，与LinkedList一样可以在任意一端进行压入、弹出的操作（都是O(1)的复杂度），ZipList是一种内存紧凑型数据结构，占用一块连续的内存空间，可以充分利用CPU缓存，而且可以根据数据的长度选择不同的编码，更有效的节省内存空间。

### 压缩列表结构

压缩列表是 Redis 为了节约内存而开发的，它是由连续内存块组成的顺序型数据结构，

![image-20221126191213626](./assets/ziplist.png)

压缩列表属性：

- ***zlbytes***：记录整个压缩列表占用对内存字节数；占4字节
- ***zltail***，记录压缩列表尾点距离起始地址有多少字节，通过这个偏移量，程序无序遍历整个压缩列表就可以确定尾结点的地址；占4字节；
- ***zllen***，记录压缩列表包含的节点数量；占2字节，当这个属性值小于UINT16_MAX(65535)时，这个属性值就是压缩列表包含所有节点的数量，当大于这个值时，节点真实数量需要遍历才能计算出；
- ***zlend***，标记压缩列表的结束点，固定值 0xFF（十进制255）。

### 节点结构

![image-20221126192607632](./assets/ziplist_entry.png)

节点属性：

- ***previous_entry_length***：前一个节点的长度，占1个或5个字节，目的是为了实现从后向前遍历；
  - 如果前一节点的长度小于254字节，则采用1个字节来保存这个长度值
  - 如果前一节点的长度大于254字节，则采用5个字节来保存这个长度值，第一个字节为0xf,后四个字节才是真实长度数据

- ***encoding***：编码属性，记录content的数据类型（字符串还是整数）以及长度，占用1个、2个或5个字节
- ***content***：负责保存节点的数据，可以是字符串或整数

##### previous_entry_length

> 压缩列表 特殊 “双端列表” A–> B –> C
>
> 正向：B的地址 = A的地址+***B.previous_entry_length***的长度+***B.encoding***长度+***B.content***长度(encoding编码对应的长度)
>
> 反向：B的地址 = C的地址-***C.previous_entry_length***的长度

##### encoding

- 字符串：如果encoding是以“00”、“01”、“10”开头，则contents是字符串

  ![image-20221126194834928](./assets/encoding_string.png)

- 整数：如果encoding是以“11”开头，则contents是整数，切encoding固定占用一个字节

  ![image-20221126195002696](./assets/encoding_integer.png)

##### content

content负责保存节点的值，节点的值可以是一个字节数组或者整数，值的类型和长度有encoding决定。

- 如果**当前节点的数据是整数**，则 encoding 会使用 **1 字节的空间**进行编码，也就是 encoding 长度为 1 字节。通过 encoding 确认了整数类型，就可以确认整数数据的实际大小了，比如如果 encoding 编码确认了数据是 int16 整数，那么 data 的长度就是 int16 的大小。

  ![image-20221126203501637](./assets/image-20221126203501637.png)

- 如果**当前节点的数据是字符串，根据字符串的长度大小**，encoding 会使用 **1 字节/2字节/5字节的空间**进行编码，encoding 编码的前两个 bit 表示数据的类型，后续的其他 bit 标识字符串数据的实际长度，即 data 的长度。

  ![image-20221126203547555](./assets/image-20221126203547555.png)

### 连锁更新

ZipList每个节点previous_entry_length属性都保存着前一个节点的长度，previous_entry_length占用1或5个字节长度，

- 如果前一个**节点的长度小于 254 字节**，那么 previous_entry_length属性需要用 **1 字节的空间**来保存这个长度值；
- 如果前一个**节点的长度大于等于 254 字节**，那么 previous_entry_length属性需要用 **5 字节的空间**来保存这个长度值；

假设一个压缩列表中有多个连续的、长度在 250～253 之间的节点：

![image-20221127173350164](./assets/zipList_update0.png)

因为entey1~entryN节点长度都小于254字节，所以previous_entry_length只需要一个字节长度来记录前一个节点的长度，这时我们将一个大于等于254字节的新节点new设置为压缩列表的头节点，即entry1的前置节点，

![image-20221127174649017](./assets/zipList_update1.png)

由于entry1的previous_entry_length的属性长度仅为1个字节，无法保存新节点的长度，所以需要对压缩列表执行空间重分配工作，entry1的previous_entry_length属性从1字节扩展到5字节。经过扩展后entry1的字节长度就超过了254字节，所以需要扩展entry2节点的长度，正如扩展 entry1引发了对 entry2扩展一样，扩展 entry2 也会引发对 entry3 的扩展，…… 一直持续到entryN节点。

![image-20221127175249361](./assets/zipList_update2.png)

这种特殊情况下产生多次空间扩展操作称之为“**连锁更新**”

## quickList

在 Redis 3.0 之前，List 对象的底层数据结构是双向链表或者压缩列表。子啊3.2版本中引入了一个新的数据结构quickList。 quicklist s是一个双向链表，链表中每个节点都是一个ZipList结构。

### quickList结构

![image-20221127184657314](./assets/quicklist.png)

```c
typedef struct quicklist {
    quicklistNode *head;	/* 头指针 */
    quicklistNode *tail;	/* 尾指针 */
    unsigned long count;	/* ziplist节点个数 即列表中总元素个数 */
    unsigned long len;		/* quicklistNode节点个数 */
    int fill : QL_FILL_BITS;              /* 指明ziplist长度 */
    unsigned int compress : QL_COMP_BITS; /* 0:禁用压缩，否则代表quicklistnode在quicklist末尾未压缩的数量 */
    unsigned int bookmark_count: QL_BM_BITS; /*Bookmakrs是realloc这个结构体使用的可选特性，这样它们在不使用时就不会消耗内存*/
    quicklistBookmark bookmarks[];
} quicklist;
```

Redis提供了一个配置项：list-max-ziplist-size来限制。

- 如果值为正，则代表ziplist的允许的entry个数的最大值

- 如果值为负，则代表ziplist的最大内存大小，分5种情况：

  1. -1：每个ziplist的内存占用不能超过4kb
  2. -2：每个ziplist的内存占用不能超过8k
  3. -3：每个ziplist的内存占用不能超过16kb
  4. -4：每个ziplist的内存占用不能超过32kb
  5. -5：每个ziplist的内存占用不能超过64kb
     其默认值为-2：

  ![image-20221127182113284](./assets/list-max-ziplist-size.png)

### quickList节点结构

```c
typedef struct quicklistNode {
    struct quicklistNode *prev;	/* 前一个quicklistNode */
    struct quicklistNode *next;	/* 后前一个quicklistNode */
    unsigned char *zl;			/* quicklistNode指向的ziplist */
    unsigned int sz;             /* ziplist 字节大小 */
    unsigned int count : 16;     /* count of items in ziplist */
    unsigned int encoding : 2;   /* 编码方式：1：原生 or 2：LZF压缩 */
    unsigned int container : 2;  /* NONE==1 or ZIPLIST==2 */
    unsigned int recompress : 1; /* 这个节点之前是否为压缩节点 */
    unsigned int attempted_compress : 1; /* node can't compress; too small */
    unsigned int extra : 10; /* more bits to steal for future usage */
} quicklistNode;
```

quick list的每个节点的实际数据是ziplist，这这种结构的优势在于节省空间，为了进一步降低使用空间，Redis可以采取LZF算法对ziplist进一步压缩。

## 跳表

