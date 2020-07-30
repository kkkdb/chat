# chat

## 概述

利用 uni-app+express+mongodb 写的实时通信聊天项目

## 安装 express、mongodb、moogose

自行百度

## 项目运行

下载个 HBuliderX，支持在多端运行项目
打开本地 MongoDB 数据库
打开 express，我用了 nodemon 热启动，在该目录下输入

```
nodemon app.js
```

对了，在 view 目录下，新建一个 config 文件夹，在新建一个 config.js 文件

```

const config = {
	baseUrl: "" //在此填上你本地服务器地址
}

export default config

```

该项目就成功启动啦~