(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{463:function(t,a,s){t.exports=s.p+"assets/img/image-20230405184544225.8436254f.png"},464:function(t,a,s){t.exports=s.p+"assets/img/image-20230405184610602.385db197.png"},465:function(t,a,s){t.exports=s.p+"assets/img/image-20230405184620049.9630de65.png"},491:function(t,a,s){"use strict";s.r(a);var v=s(2),_=Object(v.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"缓存一致性"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#缓存一致性"}},[t._v("#")]),t._v(" 缓存一致性")]),t._v(" "),a("h3",{attrs:{id:"操作缓存和数据库的问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#操作缓存和数据库的问题"}},[t._v("#")]),t._v(" 操作缓存和数据库的问题")]),t._v(" "),a("ol",[a("li",[t._v("更新缓存还是删除缓存；")]),t._v(" "),a("li",[t._v("先操作数据库还是先操作缓存；")]),t._v(" "),a("li",[t._v("如何保证数据库操作和缓存操作的原子性；")])]),t._v(" "),a("h3",{attrs:{id:"更新缓存"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#更新缓存"}},[t._v("#")]),t._v(" 更新缓存")]),t._v(" "),a("h4",{attrs:{id:"先更新数据库再更新缓存"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#先更新数据库再更新缓存"}},[t._v("#")]),t._v(" 先更新数据库再更新缓存")]),t._v(" "),a("p",[a("img",{attrs:{src:"assets/./image-20230405184522049.png",alt:"image-20230405184522049"}})]),t._v(" "),a("p",[t._v("线程1先将数据库的数据更新为 1，然后在更新缓存前，线程2 将数据库的数据更新为 2，并且将缓存更新为 2，然后线程1继续执行将缓存的数据更新为1。")]),t._v(" "),a("p",[t._v("此时，数据库中的数据是 2，而缓存中的数据却是 1，"),a("strong",[t._v("出现了缓存和数据库中的数据不一致的现象")]),t._v("。")]),t._v(" "),a("h4",{attrs:{id:"先更新缓存再更新数据库"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#先更新缓存再更新数据库"}},[t._v("#")]),t._v(" 先更新缓存再更新数据库")]),t._v(" "),a("p",[a("img",{attrs:{src:s(463),alt:"image-20230405184544225"}})]),t._v(" "),a("p",[t._v("线程1先将缓存的数据更新为 1，然后在更新数据库前，线程2 将缓存的数据更新为 2，并且将数据库的数据更新为 2，然后线程1继续执行将数据库的数据更新为1。")]),t._v(" "),a("p",[t._v("此时，数据库中的数据是 2，而缓存中的数据却是 1，"),a("strong",[t._v("出现了缓存和数据库中的数据不一致的现象")]),t._v("。")]),t._v(" "),a("blockquote",[a("p",[t._v("所以无论是【先更新数据库，在更新缓存】还是【先更新缓存，再更新数据库】都会出现缓存和数据库数据不一致的问题，两种方案相比较，第一种出现的概率更低，因为更新缓存相较于更新数据库要快很多，所以并容易出现线程2已经更新完数据库并且更新完缓存的情况下，线程1才更新完缓存")])]),t._v(" "),a("h3",{attrs:{id:"删除缓存"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#删除缓存"}},[t._v("#")]),t._v(" 删除缓存")]),t._v(" "),a("h4",{attrs:{id:"先删除缓存再更新数据库"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#先删除缓存再更新数据库"}},[t._v("#")]),t._v(" 先删除缓存再更新数据库")]),t._v(" "),a("p",[a("img",{attrs:{src:s(464),alt:"image-20230405184610602"}})]),t._v(" "),a("p",[t._v("线程1先删除缓存中的数据，此时线程2过来查询，发现缓存不存在数据则会去数据库查询，然后将查询的结果更新到缓存，然后线程1继续执行去更新数据库")]),t._v(" "),a("p",[t._v("此时，数据库中的数据是 2，而缓存中的数据仍然是旧值 1，"),a("strong",[t._v("出现了缓存和数据库中的数据不一致的现象")]),t._v("。")]),t._v(" "),a("h4",{attrs:{id:"先更新数据库再删除缓存"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#先更新数据库再删除缓存"}},[t._v("#")]),t._v(" 先更新数据库再删除缓存")]),t._v(" "),a("p",[a("img",{attrs:{src:s(465),alt:"image-20230405184620049"}})]),t._v(" "),a("p",[t._v("线程2先来查询数据，正好此时缓存中数据过了有效期，索引线程2需要去查询数据库，查询到的数据是1，准备更新缓存时，线程1过来更新了数据库的数据并且删除了缓存，线程1执行完成后，线程2继续执行更新缓存的操作。")]),t._v(" "),a("p",[t._v("此时，数据库中的数据是 2，而缓存中的数据仍然是旧值 1，"),a("strong",[t._v("出现了缓存和数据库中的数据不一致的现象")]),t._v("。")]),t._v(" "),a("blockquote",[a("p",[t._v("所以无论是【先删除缓存，再更新数据库】还是【先更新数据库，再更新缓存】都会出现缓存和数据库数据不一致的问题，两种方案相比较，【先更新数据库，再更新缓存】出现的概率更低，因为更新缓存相较于更新数据库要快很多，所以很难出现线程1已经更新完数据库并且更新完缓存的情况下，线程1才更新完缓存")])]),t._v(" "),a("h3",{attrs:{id:"结论"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#结论"}},[t._v("#")]),t._v(" 结论")]),t._v(" "),a("ol",[a("li",[a("p",[t._v("更新缓存还是删除缓存；")])]),t._v(" "),a("li",[a("p",[t._v("先操作数据库还是先操作缓存；")]),t._v(" "),a("p",[t._v("更新缓存每次更新数据库都需要更新缓存，如果这中间没有查询操作，那么对缓存的更新都是无效的操作，而删除缓存，更新数据库时让缓存失效，查询时再更新缓存，可以减少对缓存的无效操作，所以最终选择的方案是=="),a("strong",[t._v("先更新数据库，载更新缓存")]),t._v("==")])]),t._v(" "),a("li",[a("p",[t._v("如何保证数据库操作和缓存操作的原子性；")]),t._v(" "),a("p",[t._v("单体应用可以选择数据库事务，将缓存操作和数据库操作都放在数据库事务中")]),t._v(" "),a("p",[t._v("分布式系统可以选择分布式事务")])])])])}),[],!1,null,null,null);a.default=_.exports}}]);