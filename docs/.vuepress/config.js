

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
    lastUpdated: '上次更新', // 开启更新时间，并配置前缀文字   string | boolean (取值为git提交时间)

    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    markdown: {
        lineNumbers: true,
        extractHeaders: ['h2', 'h3', 'h4', 'h5', 'h6']
        
    },
    // theme: 'reco',
    theme: 'vdoing',
    themeConfig: {
        authorAvatar: '/first.jpg',
        logo: '/first.jpg',
        nav: [
            
            { text: '首页', link: '/' },
            // { text: 'Java', link: '/Java/Java'},
            //{ text: 'Redis', link: '/Redis/Redis使用' },
            {text: 'Linux',link: '/Linux/Linux基础操作'},
            { text: 'MySQL', link: '/MySQL/MySQL' },
            
            {
                text: 'Redis',
                link: '/Redis/Redis基础'
            },
            {
                text: 'kafka',
                link: '/kafka/kafka基础'
            },
            // {
            //     text: '苍晓 Java 博客',
            //     items: [
            //         { text: 'Gitee', link: 'https://gitee.com/cangxiao' },
            //         { text: 'Github', link: 'https://github.com/cangxiaocoder' },
                    
            //     ]
            // },
            
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
                        { title: "MySQL安装", path: "/MySQL/MySQL" },
                        { title: "MySQL事务", path: "/MySQL/MySQL事务" },
                        {
                            title: "MySQL加锁方式",
                            path: "/MySQL/MySQL加锁方式"
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
        },
        repo: 'cangxiaocoder/docs',
        docsDir: 'docs', // 编辑的文件夹
        docsBranch: 'main', // 编辑的文件所在分支，默认master。 注意：如果你的分支是main则修改为main
        editLinks: true, // 启用编辑
        editLinkText: '编辑',
        extendFrontmatter: {
                author: {
                    name: '苍晓',
                    link: 'https://github.com/cangxiaocoder'
                }
            },
            // 页脚信息
        footer: {
            createYear: 2022, // 博客创建年份
            copyrightInfo: '苍晓 | ', //<a href="https://github.com/cangxiaocoder/docs/blob/main/LICENSE" target="_blank">MIT License</a> 博客版权信息、备案信息等，支持a标签或换行标签</br>
        },
    },

    plugins: [
        'one-click-copy', // 代码块复制按钮
        {
            copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
            copyMessage: '复制成功', // default is 'Copy successfully and then paste it for use.'
            duration: 1000, // prompt message display time.
            showInMobile: false, // whether to display on the mobile side, default: false.
        },  
    ],
      // 监听文件变化并重新构建
    extraWatchFiles: [
        '.vuepress/config.ts',
        '.vuepress/config/htmlModules.ts',
    ]
    
}