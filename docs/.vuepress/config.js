module.exports = {
    build: {
        assetesPublicPath:"./",
    },
    head: [
        [
            'link', // 设置 favicon.ico，注意图片放在 public 文件夹下
            {
                rel: 'icon',
                href: '/first.jpg',
            }
        ]
    ],
    base: '/docs/',
    title: '苍晓coding',
    description: '苍晓的笔记',
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    markdown: {
        lineNumbers: true
    },
    theme: 'reco',
    
    themeConfig: {
        // type: 'blog',
         // 备案
        // record: 'ICP 备案文案',
        // recordLink: 'ICP 备案指向链接',
        // cyberSecurityRecord: '公安部备案文案',
        // cyberSecurityLink: '公安部备案指向链接',
        // 项目开始时间，只填写年份
        // startYear: '2022',
        authorAvatar: '/first.jpg',
        logo: '/first.jpg',
        nav: [
            { text: '首页', link: '/' },
            // { text: 'Java', link: '/Java/Java'},
            //{ text: 'Redis', link: '/Redis/Redis使用' },
            {text: 'Linux',link: '/Linux/Linux基础操作'},
            { text: 'MySQL', link: '/MySQL/MySQL' },
            
            {
                text: '中间件',
                items: [{
                        text: 'Redis',
                        link: '/Redis/Redis基础'
                    },
                    {
                        text: 'kafka',
                        link: '/kafka/kafka基础'
                    },

                ]
            },
            {
                text: '苍晓 Java 博客',
                items: [
                    { text: 'Gitee', link: 'https://gitee.com/cangxiao' },
                    { text: 'Github', link: 'https://github.com/cangxiaocoder' },
                    
                ]
            },
            
        ],
        subSidebar: 'auto',//生成子侧边栏
        sidebar: {
            
            '/Java/':[
                {
                    title: "Java",
                    path: '/Java/Java',
                    collapsable: false, // 不折叠
                    children: [
                        { title: "Java", path: "/Java/Java" },
                        // { title: "泛型", path: "/handbook/Generics" }
                    ],
                },
            ],
                        '/Linux/': [ 
                {
                    title: "Linux系统",
                    path: '/Linux/Linux基础操作',
                    collapsable: false, // 不折叠
                    children: [
                        { title: "Linux", path: "/Linux/Linux基础操作" },
                    ],
                },
            ],
            '/MySQL/': [
                {
                    title: "MySQL",
                    path: '/MySQL/MySQL',
                    collapsable: false, // 不折叠
                    children: [
                        { title: "MySQL", path: "/MySQL/MySQL" },
                        { title: "MySQL事务", path: "/MySQL/MySQL事务" },
                        {
                            title: "MySQL如何加锁",
                            path: "/MySQL/MySQL如何加锁"
                        },
                    ],
                },
            ],
            '/Redis/': [
                {
                    title: "Redis",
                    path: '/Redis/Redis',
                    collapsable: false, // 不折叠
                    children: [
                        { title: "Redis基本操作", path: "/Redis/Redis基础" },
                        { title: "Redis数据结构", path: "/Redis/Redis数据结构" },
                        {
                            title: "缓存一致性",
                            path: "/Redis/Redis缓存"
                        },
                        // { title: "泛型", path: "/handbook/Generics" }
                    ],
                }
            ],
            '/kafka/': [{
                title: "消息队列kafka",
                path: '/kafka/kafka基础',
                collapsable: false, // 不折叠
                children: [{
                        title: "kafka基础",
                        path: "/kafka/kafka基础"
                    }
                ],
            }],
            '/': [
                {
                    title: '欢迎访问',
                    path: '/',
                    collapsable: false, // 不折叠
                    children: [
                        { title: "学习笔记", path: "/" }
                    ]
                },
            ],
            
        }
    }
}