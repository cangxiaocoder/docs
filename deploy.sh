#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 拷贝目录和文件
# cp -r ../../../.github ./

git init
git add -A
git commit -m 'docs'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:cangxiaocoder/docs.git master:gh-pages
# git push -f git@gitee.com:cangxiaocoder/docs.git master:gh-pages
cd -

#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