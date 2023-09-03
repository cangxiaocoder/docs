(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{390:function(e,a,r){"use strict";r.r(a);var t=r(7),s=Object(t.a)({},(function(){var e=this,a=e._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h2",{attrs:{id:"nio"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#nio"}},[e._v("#")]),e._v(" NIO")]),e._v(" "),a("blockquote",[a("p",[e._v("Nio为non-blocking IO (非阻塞IO) 或New IO")])]),e._v(" "),a("h3",{attrs:{id:"三大组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#三大组件"}},[e._v("#")]),e._v(" 三大组件")]),e._v(" "),a("h4",{attrs:{id:"channel"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#channel"}},[e._v("#")]),e._v(" Channel")]),e._v(" "),a("p",[e._v("channel类似于stream，它是读写数据的双向通道，可以从channel降数据读入到buffer,也可以将buffer中的数据写入channel，而stream要么只能输入要么只能输出，channel比stream更底层")]),e._v(" "),a("p",[e._v("常见channel")]),e._v(" "),a("ul",[a("li",[e._v("FileChannel")]),e._v(" "),a("li",[e._v("DatagramChannel")]),e._v(" "),a("li",[e._v("SocketChannel")]),e._v(" "),a("li",[e._v("ServerSocketChannel")])]),e._v(" "),a("h4",{attrs:{id:"buffer"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#buffer"}},[e._v("#")]),e._v(" Buffer")]),e._v(" "),a("p",[e._v("buffer用于缓冲读写数据，常见buffer有")]),e._v(" "),a("ul",[a("li",[e._v("ByteBuffer\n"),a("ul",[a("li",[e._v("MappedByteBuffer")]),e._v(" "),a("li",[e._v("DirectByteBuffer")]),e._v(" "),a("li",[e._v("HeapByteBuffer")])])]),e._v(" "),a("li",[e._v("ShortBuffer")]),e._v(" "),a("li",[e._v("IntBuffer")]),e._v(" "),a("li",[e._v("LongBugger")]),e._v(" "),a("li",[e._v("FloatBuffer")]),e._v(" "),a("li",[e._v("DoubleBuffer")]),e._v(" "),a("li",[e._v("CharBuffer")])]),e._v(" "),a("h4",{attrs:{id:"selector"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#selector"}},[e._v("#")]),e._v(" Selector")]),e._v(" "),a("h5",{attrs:{id:"服务器设计-多线程版设计"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#服务器设计-多线程版设计"}},[e._v("#")]),e._v(" 服务器设计-多线程版设计")]),e._v(" "),a("p",[e._v("每个线程和socket一一对应，每个socket都需要一个线程来处理")]),e._v(" "),a("p",[e._v("缺点：")]),e._v(" "),a("ul",[a("li",[e._v("内存占用高")]),e._v(" "),a("li",[e._v("线程多导致线程上下文切换成本高")]),e._v(" "),a("li",[e._v("只适合连接时较少的场景，连接数多的时候会导致需要同时创建很多线程")])]),e._v(" "),a("h5",{attrs:{id:"服务器设计-线程池版设计"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#服务器设计-线程池版设计"}},[e._v("#")]),e._v(" 服务器设计-线程池版设计")]),e._v(" "),a("p",[e._v("每个线程可以重复使用，用来处理多个socket链接，不需要创建更多的线程")]),e._v(" "),a("p",[e._v("缺点：")]),e._v(" "),a("ul",[a("li",[e._v("阻塞模式下，一个线程只能处理一个socket连接")]),e._v(" "),a("li",[e._v("仅使用和短连接的场景，")])]),e._v(" "),a("h4",{attrs:{id:"服务器设计-selector版"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#服务器设计-selector版"}},[e._v("#")]),e._v(" 服务器设计-selector版")]),e._v(" "),a("p",[e._v("selector的作用就是配合一个现成来管理多个channel，获取这些channel上发生的事件，这些channel工作在非阻塞模式下，不会让线程阻塞在一个channel上，适合连接数比较多但是流量低的场景；")]),e._v(" "),a("p",[e._v("调用selector的select()方法会阻塞直到channel发生了读写就绪事件，这些事件发生，select()方法就会返回这些事件交给Thread来处理")]),e._v(" "),a("div",{staticClass:"language-mermaid line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-mermaid"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("graph")]),e._v(" TD\nThread"),a("span",{pre:!0,attrs:{class:"token arrow operator"}},[e._v("--\x3e")]),e._v("selector"),a("span",{pre:!0,attrs:{class:"token arrow operator"}},[e._v("--\x3e")]),e._v("channel1\nselector"),a("span",{pre:!0,attrs:{class:"token arrow operator"}},[e._v("--\x3e")]),e._v("channel2\nselector"),a("span",{pre:!0,attrs:{class:"token arrow operator"}},[e._v("--\x3e")]),e._v("channel3\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br"),a("span",{staticClass:"line-number"},[e._v("2")]),a("br"),a("span",{staticClass:"line-number"},[e._v("3")]),a("br"),a("span",{staticClass:"line-number"},[e._v("4")]),a("br")])])])}),[],!1,null,null,null);a.default=s.exports}}]);