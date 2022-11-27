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
            { text: 'Linux', link: '/Linux/Linux' },
            { text: 'MySQL', link: '/MySQL/MySQL' },
            { text: 'Redis', link: '/Redis/Redis使用' },
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
                    title: "Linux",
                    path: '/Linux/Linux',
                    collapsable: false, // 不折叠
                    children: [
                        { title: "Linux", path: "/Linux/Linux" },
                        // { title: "泛型", path: "/handbook/Generics" }
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
                        { title: "MySQL锁", path: "/MySQL/MySQL锁" },
                    ],
                },
            ],
            '/Redis/': [
                {
                    title: "Redis",
                    path: '/Redis/Redis',
                    collapsable: false, // 不折叠
                    children: [
                        { title: "Redis使用", path: "/Redis/Redis使用" },
                        { title: "Redis数据结构", path: "/Redis/Redis数据结构" },
                        // { title: "泛型", path: "/handbook/Generics" }
                    ],
                }
            ],
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