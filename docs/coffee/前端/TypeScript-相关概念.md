# TypeScript-相关概念

## 📄 TypeScript
TypeScript (opens new window)：是 JavaScript 的超集，拥有类型机制，不能在浏览器直接执行，而是编译成 JavaScript 后才会运行。

- 超集（superset）：比如 ES6 包含了 ES5 所有的内容，还有一些独特的语法特性，就可以理解为 ES6 是 ES5 的超集
- 类型：指的是静态的类型，js 中一个存放字符串的变量，后续依旧可以将数字、对象、数组等类型赋值到该变量，这是动态类型。
- 而 ts 则是静态类型，后续不可更改类型

## 📄 tsc 的安装与使用
`.ts` 文件是不可以直接执行的，需要编译为 `.js` 文件，才能够进行运行。

`tsc` 是 `typescript compiler` 的缩写，即 `ts` 的编译器。

``` bash
# npm 全局安装 TypeScript
npm install typescript -g

# 检查是否存在 tsc 环境变量，配置正确时会回应tsc的版本号
tsc -v

# 尝试创建ts文件并写入一些内容
touch demo.ts && echo 'console.log("Hello ts!")' > demo.ts

# 将ts文件编译为同名js文件后运行
tsc demo.ts && node demo.js

# 将当前目录下所有文件编译为同名js文件
tsc *
```

上方的例子分为了两步（先转换在运行），可以通过 `ts-node`，来进行合并操作：
``` bash
# npm 项目中安装 ts-node
npm install ts-node -D

# 直接进行运行
ts-node demo.ts
```

## 📄 类型推断

## 📄 类型注解

## 📄 静态类型

## 📄 类型断言

## 📄 类型保护

## 📄 类型兼容



