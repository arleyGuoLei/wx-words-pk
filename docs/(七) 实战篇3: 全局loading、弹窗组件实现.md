# (七) 实战篇3: 封装一个全局loading组件

本篇主要分享给大家的有：如果优雅的在微信小程序中抽离一个全局loading组件，如何封装才能在全局任何地方方便调用，类似的还有一个全局弹窗组件。

## 单词天天斗的全局loading组件

### loading组件的实现

组件的实现很简单，就是一个图片(静态)和一个文案(动态传入)，然后组件拥有`show`、`hide`两个方法

```html
<!--loading组件-->
<view wx:if="{{show}}" class="mask" style="background-color:{{mask?'rgba(255, 255, 255, 0.4)':'transparent'}}">
  <view class="loading">
    <image src="./../../images/loading.png" class="loading-icon rotate time-2s" />
    <text class="loading-text">{{loadingText}}</text>
  </view>
</view>
```

```js
Component({
  options: {
    addGlobalClass: true
  },
  data: {
    show: false,
    mask: false,
    loadingText: '加载中···'
  },
  methods: {
    show(loadingText, mask) {
      this.setData({ loadingText, show: true, mask })
    },
    hide() {
      this.setData({ show: false, mask: false })
    }
  }
})

```

```css
.mask {
  position: absolute;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.loading {
  display: flex;
  flex-direction: column;
  position: absolute;
  align-items: center;
  width: 100%;
  top: 45vh;
}

.loading-icon {
  width: 44rpx;
  height: 44rpx;
}

.loading-text {
  margin-top: 28rpx;
  font-size: 28rpx;
  color: #333333;
}
```

### loading组件的引入 (分享点)

比较想分享的其实是这一个点，在小程序中这样调用组件方法真的很香

- 1. 在全局`app.json`中引入`loading`组件

```json
  "usingComponents": {
    "loading": "/components/loading/loading"
  }
```

- 2. 在需要用到加载组件的页面，都加入组件的引入代码，引入后就不需要在页面代码中在加入其它关于引入或者操作的代码

```html
<!-- home.wxml -->
<loading id="loading"/>
```

- 3. 对代码进行抽离

```js
// Tool.js

function getLoaingObj() {
  const page = getCurrentPages() // 获取当前页面栈
  return page[page.length - 1].selectComponent('#loading') // 当前显示的页面中找到loading组件
}

export default {
  // 其他全局功能 ...
  loading(loadingText = '斗斗加载中···', mask = true) {
    const loading = getLoaingObj()
    if (loading) {
      loading.show(loadingText, mask) // 调用loading组件的show方法实现显示，这样就不需要在每个页面的js部分写一次获取loading组件和show
    }
  },
  hideLoading() {
    const loading = getLoaingObj()
    if (loading) {
      loading.hide() // 同 show
    }
  }
}

```

- 4. 在任意地方的JS中使用

```js
import $ from './Tool'

$.loading('生成随机词汇中...')
```

### 弹窗组件

单词天天斗中的弹窗组件也是类似的，核心思想也是通过父组件找到子组件引用，直接调用子组件中的方法显示或隐藏弹窗

```js
const page = getCurrentPages() // 获取当前页面栈

const component = page[page.length - 1].selectComponent('#组件id') // 获取页面组件

component.fun() // 调用子组件方法
```
