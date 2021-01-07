# 单词天天斗

系统演示视频：[https://www.bilibili.com/video/BV1hg4y1i714](https://www.bilibili.com/video/BV1hg4y1i714)

微信：34805850，期待大佬关注微信公众号：前端面试之道，部署文档微信联系 ~

## 在线体验

![二维码](https://i.loli.net/2020/08/01/kVxqNZCMw5TvLz3.jpg)

## UI截图

![s_1](https://i.loli.net/2020/08/01/TySr3XhVuZYtvN1.png)
![s_2](https://i.loli.net/2020/08/01/6euQ1OMJTPYAZaw.png)
![s_3](https://i.loli.net/2020/08/01/4Ign6oueRpcSLsW.png)
![s_4](https://i.loli.net/2020/08/01/n5ZfqgRvQGhmuDz.png)
![s_5](https://i.loli.net/2020/08/01/Wgtd91nljzrbTkh.png)
![s_6](https://i.loli.net/2020/08/01/l9f23VWB16AZdrF.png)
![s_7](https://i.loli.net/2020/08/01/nT8W3NtLJR1lUxj.png)
![s_8](https://i.loli.net/2020/08/01/Te7mtCPquUvzJiN.png)
![s_9](https://i.loli.net/2020/08/01/r1RXbgYtjlCTBEw.png)

### 需求概述

![需求图解](http://img.i7xy.cn/20200529180121.png)

### 单词对战模式

#### 对战业务需求解析

单词对战的游戏核心为：**随机生成**一定数量的单词列表的单选题类型题目，题目文本为该单词，有 4 个随机中文释义的选项，其中仅有一个为正确释义，双方用户一起选择释义，正确率高且速度快的用户获得对战胜利。

单词对战游戏分为**好友对战**、**随机匹配**、**人机对战**三种对战的形式，均通过上述游戏核心的方式进行对战。

#### 对战设置

用户还可以对以下对战信息进行自定义设置

- 对战的单词书，用户可以选择自己想要背诵的**单词类型**，包含四级核心词、四级大纲词、六级核心词、六级大纲词、考研真题核心词、考研大纲词、小学必备词、中考大纲词、高考大纲词、雅思大纲词、商务词汇等多种单词书，亦可以选择随机单词书模式，则将从所有的单词中进行随机抽取；
- 设置每一局**对战的单词数目**为以下任意一种：8、 10(默认)、 12、 15、 20
- 设置切换下一题是否自动播放**单词发音**
- 设置错词是否加入到**生词本**
- 开始和错词的时候是否**震动**
- 设置默认是否播放**背景音乐**，游戏中也可以随时关闭/开启背景音乐

#### 其他细节优化

- 加入`正在对战过程中`、`对战已结束`、`房间已满`等非正常类型房间，做出相应的交互提示，然后跳转至首页
- 在对战过程中任意用户**退出游戏**或掉线，则结束本局游戏，进行对战结算
- 对战结束后，房主可以选择**再来一局**，当房主创建好再来一局的房间后，另外一个用户可以选择再来一局，加入继续对战
- 在对战过程中，选择错误的单词或使用**提示卡**选择的单词，自动加入到用户**生词本**，用户可以在生词本中进行复习
- 加入**倒计时机制**，每一个单词的对战周期为 10s，超时则判断为错选

#### 完整对战流程图

![完整对战流程图](http://img.i7xy.cn/20200529180939.png)

### 词汇挑战模式

#### 词汇挑战模式业务解析

词汇挑战的核心为：获取随机的一个单词作为单选题题目文本，包含四个中文释义选项，其中一个为正确答案，选择错误则失败，选择正确再获取随机单词，循环下去。

#### 挑战复活机制

在词汇挑战的过程中，如果选择错误，可以有两次**复活**机会

- 首次复活：通过**分享小程序**获得复活机会
- 第二次复活：通过观看一个 15s 之内的**广告**获得复活机会
- 当第三次选择错误，显示**再来一局**，从零开始记录分数

#### 其他

- 词汇挑战每正确一个词，得分增加 100 分
- 当挑战失败的时候，如果挑战分数高于历史最高分数，则修改历史最高分数为当前分数，用于排行榜排行
- 可以使用提示卡进行选择

#### 完整挑战流程图

![完整挑战流程图](http://img.i7xy.cn/20200529181248.png)

### 其他功能

#### 生词本

- 用户可以在生词本中查看在单词对战模式、词汇挑战模式中选择错误的单词
- 可以查看单词及单词释义、播放单词发音、删词生词
- 在设置中可以一键清空所有生词

#### 学习打卡

- 当在单词对战模式中，当天对战局数超过 5 局且胜利局数超过 2 局，则打卡成功
- 可以在在打卡页面查看当日进度，可以查看历史的打卡日历

#### 排行榜

- 排行榜包含词力值、词汇挑战分数、签到天数等排名信息
- 每类排行版显示前 20 名的排名头像和昵称以及分数
- 显示自己当前类目下的排名以及分数

#### 用户相关

- 数据库应记录的用户数据包含：昵称、头像、对战局数、胜利局数、选择的单词本、词力值
- 词力值机制：在单词对战模式、单词挑战模式中，每局对战都可以获得相应的词力值分数，作为用户的经验值

#### 其他

- 建议反馈：用户可以在小程序中，反馈意见，然后再后台可以查看用户留言
- 打赏作者：用户可以在小程序中，通过扫码的形式，对小程序进行打赏
- 小程序友情链接：可通过当前小程序跳转至作者的其他小程序中
- 小程序中加入部分广告，不影响用户体验

## 团队组成

整个项目的**产品方案**、**UI 设计**、**开发**、**测试**、**上线运营**等皆一个人**独立完成**。

## 技术方案

### 设计

设置使用**sketch**完成，设计稿上传至`蓝湖`，作为数据标注。

#### 蓝湖链接

链接：[https://lanhuapp.com/url/qe2Dl](https://lanhuapp.com/url/qe2Dl) 密码: ydIX

#### 设计图源文件

![首页和单词书封面设计图](http://img.i7xy.cn/20200529182414.png)

![对战页面设计图](http://img.i7xy.cn/20200529182440.png)

![对战结束、生词本、排行榜设计图](http://img.i7xy.cn/20200529182459.png)

![设置、词汇挑战设计图](http://img.i7xy.cn/20200529182519.png)

下载链接: [https://pan.baidu.com/s/1KsZjvlTUbtyYFDcVCy91lg](https://pan.baidu.com/s/1KsZjvlTUbtyYFDcVCy91lg) 密码:vylm

### 开发技术栈

- 前端：**原生**微信小程序
- 服务端：微信小程序**云开发**

### 其他工具

- ESLint
- Git + Github
- vscode
- Electron
- NodeJS
- Python

### 系统架构

#### 项目文件简介

```tree
├── cloudfunctions # 云开发_云函数目录
|  ├── model_auto_sign_trigger # 自动签到定时触发器
|  ├── model_book_changeBook # 改变单词书
|  ├── model_userWords_clear # 清除用户生词
|  ├── model_userWords_get # 获取用户生词
|  └── model_user_getInfo # 获取用户信息
├── db # 数据整理的脚本
├── design # 设计稿文件、素材文件
|  └── words-pk-re.sketch # 设计稿
├── docs # 项目文档
├── miniprogram # 小程序前端目录
|  ├── app.js # 小程序全局入口
|  ├── app.json # 全局配置
|  ├── app.wxss  # 全局样式
|  ├── audios # 选词正确错误的发音
|  |  ├── correct.mp3
|  |  └── wrong.mp3
|  ├── components # 全局组件
|  |  ├── header # header组件
|  |  ├── loading # 全局loading
|  |  └── message # 全局弹窗
|  ├── images
|  |  ├── ... 图片素材
|  ├── miniprogram_npm # 小程序npm目录
|  |  └── wxapp-animate # 动画库
|  ├── model # 所有的数据库操作
|  |  ├── base.js # 基类，所有集合继承该基类
|  |  ├── book.js # 单词书集合
|  |  ├── index.js # 导出所有数据库操作
|  |  ├── room.js # 房间集合
|  |  ├── sign.js # 签到集合
|  |  ├── user.js # 用户集合
|  |  ├── userWord.js # 生词表集合
|  |  └── word.js # 单词集合
|  ├── pages # 页面
|  |  ├── combat # 对战页
|  |  ├── home # 首页
|  |  ├── ranking # 排行榜
|  |  ├── setting # 设置页
|  |  ├── sign # 签到页
|  |  ├── userWords # 生词表页
|  |  └── wordChallenge # 单词挑战
|  └── utils
|     ├── Tool.js # 全局工具类，放了加载、全局store等
|     ├── ad.js # 广告
|     ├── log.js # 日志上报
|     ├── router.js # 全局路由
|     ├── setting.js # 全局设置
|     └── util.js # 全局工具函数
├── package.json
└── project.config.json # IDE设置、开发设置
```

#### 云开发数据交互的 Model 层设计

在该项目中，将所有的服务端交互、数据库的读取、云函数的调用都放到了 model 目录下，对该目录结构深入解析。

##### (1) Base.js

base 基类，所有其他数据集合都继承该类，在构造函数中，用来做数据集合初始化和生命一些可能所需用到的变量。

```js
import $ from './../utils/Tool'

const DB_PREFIX = 'pk_'

export default class {
  constructor(collectionName) {
    const env = $.store.get('env')
    const db = wx.cloud.database({ env })
    this.model = db.collection(`${DB_PREFIX}${collectionName}`)
    this._ = db.command
    this.db = db
    this.env = env
  }

  get date() {
    return wx.cloud.database({ env: this.env }).serverDate()
  }

  /**
   * 取服务器偏移量后的时间
   * @param {Number} offset 时间偏移，单位为ms 可+可-
   */
  serverDate(offset = 0) {
    return wx.cloud.database({ env: this.env }).serverDate({ offset })
  }
}

```

##### (2)其他集合文件 (model 目录下，除了 base 和 index 之外的文件)

在这些文件中，对应和文件名同名的集合的所有数据操作，比如 book.js 中，包含了所有对 pk_book 集合的所有数据增删改查操作。

```js
import Base from './base'
import $ from './../utils/Tool'
const collectionName = 'book'

/**
 * 权限: 所有用户可读
 */
class BookModel extends Base {
  constructor() {
    super(collectionName)
  }

  async getInfo() {
    const { data } = await this.model.get()
    return data
  }

  async changeBook(bookId, oldBookId, bookName, bookDesc) {
    if (bookId !== oldBookId) {
      const { result: bookList } = await $.callCloud('model_book_changeBook', { bookId, oldBookId, bookName, bookDesc })
      return bookList
    }
  }
}

export default new BookModel()

```

##### (3)index.js

在该文件中，对所有的数据集合操作文件进行引入，然后又导出，之后在其他文件中的的调用，就只需要引入该文件即可，就可以实现调用不同的集合操作。

```js
import userModel from './user'
import bookModel from './book'
import wordModel from './word'
import roomModel from './room'
import userWordModel from './userWord'
import signModel from './sign'

export {
  userModel,
  bookModel,
  wordModel,
  roomModel,
  userWordModel,
  signModel
}
```

#### 环境区分

在小程序初始化的时候，对云开发环境进行了全局的初始化，区别开发环境和正式环境。

```js
// app.js
  initEnv() {
    const envVersion = __wxConfig.envVersion
    const env = envVersion === 'develop' ? 'dev-lkupx' : 'prod-words-pk' // 'prod-words-pk' // ['develop', 'trial', 'release']
    wx.cloud.init({
      env,
      traceUser: true
    })
    this.store.env = env
  },
  onLaunch() {
    this.initEnv()
    this.initUiGlobal()
  },
```

### 难点解析

#### 难点 1：单词数据

##### 1. 抓包分析和代码实现

本课题中使用 MacOS 系统、Charles 抓包软件、安卓手机作为抓包的基本环境。首先在电脑上安装 Charles，然后开启 Proxy 抓包代理，同局域网下配置手机 WiFi 代理实现抓取手机包。

##### 2. 单词数据整理

通过爬虫下来的单词数据如下，对于该课题的项目单词数据相对复杂，所以我们对单词数据结构进行简化，只提取项目中需要的字段，以单词 yum 为例：

优化前：

```json
{"wordRank":63,"headWord":"yum","content":{"word":{"wordHead":"yum","wordId":"PEPXiaoXue4_2_63","content":{"usphone":"jʌm","ukphone":"jʌm","ukspeech":"yum&type=1","usspeech":"yum&type=2","trans":[{"tranCn":"味道好","descCn":"中释"}]}}},"bookId":"PEPXiaoXue4_2"}
```

优化后：

```json
{"rank":286,"word":"yum","bookId":"primary","_id":"primary_286","usphone":"jʌm","trans":[{"tranCn":"味道好"}]}
```

通过 NodeJS 编写批量格式整理的程序，整理后导出 JSON 文件

![整理数据的代码](http://img.i7xy.cn/20200529184132.png)

##### 3. 数据文件批量导入(传入数据库)

由于微信小程序云开发控制台不支持数据文件的批量导入数据库，所以开发了一个支持云开发数据集合批量导入的程序

![批量导入首页](http://img.i7xy.cn/20200529184226.png)

![批量导入过程](http://img.i7xy.cn/20200529184242.png)

![导入测试](http://img.i7xy.cn/20200529184321.png)

- 数据库批量导入程序更多解析：[https://juejin.im/post/5e2bf3e4f265da3e4244ea7f](https://juejin.im/post/5e2bf3e4f265da3e4244ea7f)
- 程序代码开源：[https://github.com/arleyGuoLei/wxcloud-databases-import](https://github.com/arleyGuoLei/wxcloud-databases-import)

#### 难点 2：单词对战模式

本节详细解析单词对战模式的实现，将从创建房间（生成随机词汇、新增房间数据）、对战监听、对战过程（好友对战、随机匹配、人机对战）、对战结算的角度进行分析。

##### 创建对战房间

对战房间的创建，分为触发创建房间事件、获取当前选择的单词书、获取单词对战每一局的词汇数量、从数据库 pk_word 集合读取随机单词、格式化获取的随机单词列表、创建房间（使用生成的单词列表、是否好友对战条件)、根据房间的 roomId(主键)跳转至对战页等多个步骤流程组成。

![创建流程图](http://img.i7xy.cn/20200529185059.png)

##### 房间数据监听

单词对战模式中，对 room 数据集合的监听是对战的核心要点，进入对战页面后，调用数据集合的 WatchAPI 对 room 集合中的当前房间记录进行监听，在当前房间记录数据发生变化的时候，将会调用 watch 函数的回调，执行相应的业务，详细流程如下：

![房间数据监听](http://img.i7xy.cn/20200529185136.png)

##### 好友对战的实现

有了前面创建好的对战房间，也建立好了对当前房间的数据监听，接下来就可以实现有趣的对战交互了。游戏会监听好友用户准备，更新 room 集合中的 right.openid 字段，触发 watch，通知房主可以开始对战；房主点击开始对战，会更新 room 集合中的 state 字段为 PK，watch 回调通知双方开始对战，显示第一道题目，双方用户选择释义的时候，会把选择结果和得分更新至 left/right 中的 grades 和 gradeSum 字段，在 watch 的回调中对双方的选择结果进行显示；当对战到达最后一道题目，且双方都选择完毕，进入结算流程，将房间 state 更新至 finish；如果在对战过程中，有任意用户离开对战，将修改房间 state 为 leave；对战结束之后，房主可以选择再来一局，进行创建房间，更新上一个房间的 nextRoomId 字段，在 watch 回调中通知非房主用户可以加入新的房间，进行再来一局的对战。

![好友对战](http://img.i7xy.cn/20200529185229.png)

##### 随机匹配的实现

随机匹配对战相对于好友对战的区别在于：好友对战是通过房主将房间链接(roomId)分享到微信好友/微信群，当用户点击分享卡片之后，会跳转至对战页面且房间 Id 为当前分享的房间 roomId，用户进入房间之后就进行上述的监听操作和准备、开始对战等。然而随机匹配的实现原理为，当用户触发随机匹配操作之后，会先在数据库检索有没有符合自己所选择的单词书、目前房主在等待的房间，如果有则加入该房间，如果没有则创建新的随机匹配房间，等待其他用户进入。用户进入之后会自动触发准备操作，房主在 watch 中监听到有用户准备，然后自动触发开始对战操作，后续对战、结算、再来一局流程则和好友对战流程一致。

![随机匹配](http://img.i7xy.cn/20200529185302.png)

##### 人机对战的实现

人机对战的核心思想为：房主用户端随机取一名人机用户，房主端触发人机的自动准备，房主端也自动开始对战，在对战过程中，房主端通过页面 UI 用户手动选词，人机将在 2~5s 或房主选词之后随机完成选词操作，正确率为 75%。
后期可以对正确率进行优化，根据用户的历史正确率进行自动化推算，实现更智能的人机用户，提供更好的用户体验。

![人机对战](http://img.i7xy.cn/20200529185321.png)

微信小程序云开发实现的单词PK小程序，支持好友对战、随机匹配、人机模式，完整代码 ~ UI可以披靡市场上所有同类型小程序，体验也是一流的哦 ~ 目前已经有同学在QQ小程序、阿里小程序部署；也有同学修改成了`公务员题库` ~ 期待看到各类优秀产品上线哦 ~

上线说明: 源码开源，但**上线需要经过作者许可哦 ~ 开发不易、创作不易**。需要支付RMB `200+`方可上线，保障作者著作权益 ~ 如果你觉得项目对你有所帮助 ~ 期待得到你的打赏哦，每一分收入，都能让我在开源路上不放弃！慢慢开源这些年独立开发的项目！

## 收费服务

> 微信：34805850，期待大佬关注微信公众号：前端面试之道

- 部署文档：`66+`获取小程序部署文档，根据文档可以很简单的跑起来项目 ~
- 自己修改代码上线任意一个平台，需支付`200+` (开发不易，相信你上线后，通过广告也可以回本)，授权单个小程序
- 新需求：想在小程序源码基础上开发新功能的，根据需求难度定制开发；亦或者自己研究代码直接新增即可
- 合作：如果您是某某英语培训机构，想拥有自己品牌的背单词程序，欢迎联系，帮部署及合作定制开发，￥4000+
- 其他合作：欢迎骚扰 ~

### 请作者喝咖啡

![微信扫码赞赏](https://i.loli.net/2020/08/01/sYbEd2S1wjLuUvk.png)
