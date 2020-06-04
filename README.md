# 单词天天斗 - 系统环境搭建

## 一. 获取代码

### 压缩包

代码会通过压缩包的形式给到指导老师，可以直接解压获取代码。

### Github仓库

项目代码托管于`github`，具体仓库地址为：[https://github.com/arleyGuoLei/wx-words-pk](https://github.com/arleyGuoLei/wx-words-pk)

> 由于仓库暂时为私有仓库，如果需要通过该方式更新或下载代码，可以联系邮箱：`arley@i7xy.cn`，获取相应仓库权限。

可以通过下列命令进行拉取(需安装git和配置github秘钥)

```bash
git clone git@github.com:arleyGuoLei/wx-words-pk.git
```

目前有三个主要的分支：

- master: 稳定版/线上版本
- dev: 开发板，目前在进行功能迭代的分支
- docs: 内含一些项目文档，代码落后于线上版和开发版

## 二. 小程序环境及注册

### 注册小程序

因为目前小程序的`appid`绑定的是我的个人微信，所以如果需要运行代码，需要我这边帮忙添加权限。或者通过自行注册小程序的方法来运行。

可以按照小程序官方文档来进行注册：[https://developers.weixin.qq.com/miniprogram/introduction/#%E5%BC%80%E5%8F%91%E5%89%8D%E5%87%86%E5%A4%87](https://developers.weixin.qq.com/miniprogram/introduction/#%E5%BC%80%E5%8F%91%E5%89%8D%E5%87%86%E5%A4%87)

最终获取到一个属于自己的`appid`即可

### 小程序开发环境

通过小程序官方文档，下载适合自己系统的平台IDE即可，下载地址：[https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

## 三. 运行小程序代码


### 导入代码

使用微信小程序IDE导入项目代码，填写自己的`appid`，点击导入即可。

![导入代码](https://imgkr.cn-bj.ufileos.com/966113ff-c4a6-4310-9856-c386b369b207.png)

### 初始化云开发环境

使用自己的`appid`，申请开通云开发，免费额度可以开通两个环境，一个用于开发环境，一个用于线上运行环境。

具体云开发开通教程，查看文档：[云开发相关微信文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/quickstart.html#_2-%E5%BC%80%E9%80%9A%E4%BA%91%E5%BC%80%E5%8F%91%E3%80%81%E5%88%9B%E5%BB%BA%E7%8E%AF%E5%A2%83)

初始化完成之后，请记住**环境id**，后面代码需要修改 ~

### 导入数据库

在数据库中，需要创建如下几个集合，然后部分需要导入数据

- pk_book (需要导入数据)
  - 权限：所有用户可读
- pk_word (需要导入数据)
  - 权限：所有用户可读
- pk_room
  - 权限：`{"read": true, "write": true}`
- pk_sign
  - 权限：仅创建者可读写
- pk_user
  - 权限：所有用户可读，仅创建者可读写
- pk_userWord
  - 权限：仅创建者可读写

![创建和导入集合](https://imgkr.cn-bj.ufileos.com/ec9ae925-1d53-47d8-b5fd-fcb56d46dddb.png)

下方是数据库的导入文件路径

- `pk_book`集合数据源：`数据库导入基础数据/pk_book.json`
- `pk_word`集合数据源：`数据库导入基础数据/pk_word.json`

### 修改环境ID

修改`app.js`中的环境id为自己申请的云开发环境id

![修改环境ID](https://imgkr.cn-bj.ufileos.com/4acce304-4333-45e5-85d2-0e8c2257bc33.png)

### 部署云开发云函数文件

在小程序IDE中，选择`cloudfunctions`目录，设置当前开发环境。然后在下面的云函数上右键点击打开菜单，选择`创建并部署：云端安装依赖（不上传node_modules）`

![上传部署云函数](https://imgkr.cn-bj.ufileos.com/b5243736-732f-4bfe-9674-8996c860ced8.png)

至此，小程序可以正常运行 ~ 可以选择预览，手机扫码体验

## 继续开发

上面已经把项目跑起来了，如果需要继续开发，建议使用`npm`安装一下`eslint`，使用`vscode`进行开发，体验比小程序IDE开发要完美很多 ~

在项目根目录执行`npm install`将自动安装依赖文件 ~

### 其他

由于小程序参加了比赛和后期可能会售出代码给一个团队，所以请勿外泄代码，此致。

谢谢老师的教导和帮助 ~