# miaow-less-parse

> Miaow的Less编译工具

## 效果示例

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
