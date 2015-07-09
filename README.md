# miaow-less-parse

> Miaow的Less编译工具

```less
/* foo.less */
@import "./bar";
@import "foz";

.foo {
  color: grey;
}

/* bar.less */
@import "baz.css";

@color: red;

.bar {
  color: @color;
}

/* bower_components/foz/main.less */
.foz {
  color: yellowgreen;;
}

/* 处理后 */
/* foo.less */
@import "baz.css";
.bar {
  color: red;
}
.foz {
  color: yellowgreen;
}
.foo {
  color: grey;
}
```

## 使用说明

### 安装

```
npm install miaow-less-parse --save-dev
```

### 在项目的 miaow.config.js 中添加模块的 tasks 设置

```javascript
//miaow.config.js
module: {
  tasks: [
    {
      test: /\.less$/,
      plugins: ['miaow-less-parse']
    }
  ]
}
```
