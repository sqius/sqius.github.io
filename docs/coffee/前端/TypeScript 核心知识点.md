# 一杯咖啡的时间 掌握TypeScript知识点
TypeScript ：是 JavaScript 的超集，拥有类型机制，不能在浏览器
直接执行，而是编译成 JavaScript 后才会运行。

## tsc 的安装与使用
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

## 基础类型
### 基本类型
> `number` , `string` , `boolean` ,  `symbol` , `null` 和 `undefined`
#### number 数值类型
``` ts
let num: number = 123;
num = 0b1111011; // 二进制的123
num = 0o173; // 八进制的123
num = 0x7b; // 十六进制的123
```
::: tip
TS中指定类型的时候要用 `number` ，这个是 `TypeScript` 的类型关键字。而 `Number` 为 `JavaScript` 的原生构造函数，用它来创建数值类型的值。
:::

#### string 字符串
``` ts
let str: string = "hello";
const str2 = "typescript";
str = `${str} ${str2}`; // hello typescript
```

#### boolean 布尔类型
``` ts
let bool: boolean = false;
let bool1: boolean = !!0 // false
```

#### null 和 undefind
``` ts
const u: undefined = undefined;
const n: null = null;
let str: string | null = 'abc'
str = null
str = undefined  // 不能将类型“undefined”分配给类型“string | null”
```

::: tip undefined 和 null
在 JavaScript 中，undefined 和 null 是两个基本数据类型。

在 TypeScript 中，这两者都有各自的类型，即 undefined 和 null，也就是说它们既是实际的值，也是类型。

undefined 和 null 是所有类型的子类型, 默认情况下 undefined 和 null 可以赋值给任意类型的值;

但在 tsconfig.json 的 "compilerOptions" 里设置了 "strictNullChecks": true 时，
undefined 和 null 将只能赋值给它们 自身和 void 类。
TS 对可选属性和对可选参数的处理一样，会被自动加上 `|undefined`
``` ts
const sum = (x: number, y?: number) => {
  return x + (y || 0);
};

sum(1); // 1
sum(1, 2); // 3
sum(1, undefined); // 1
sum(1, null); // error Argument of type 'null' is not assignable to parameter of type 'number | undefined'
```
:::

#### symbol
``` ts
// symbol是 ES6 新增的一种基本数据类型，用来表示独一无二的值。
const s1 = Symbol('s1')
const s2 = Symbol('s2')

s1 === s2 // This condition will always return 'false' since the types 'typeof s1' and 'typeof s2' have no overlap.

// 使用Symbol作为属性名
let name = Symbol();
let obj = { [name]: "walawala" };
console.log(obj); // { Symbol(): 'walawala' }
```
::: tip symbol
symbol 类型值作为属性名，这个属性不会被for…in遍历到,
也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()获取到;

可以使用Object.getOwnPropertySymbols方法获取对象的所有symbol类型的属性名：
```ts
Object.getOwnPropertySymbols(obj);
```
可以使用 ES6 新提供的 Reflect 对象的静态方法Reflect.ownKeys，所有类型的属性名：
``` ts
Reflect.ownKeys(obj)
```

for 和 keyFor
Symbol.for 方法传入字符串，会先检查有没有使用该字符串调用 Symbol.for 方法创建的 symbol 值，如果有，返回该值，如果没有，则使用该字符串新创建一个
``` ts
const s1 = Symbol("abc");
const s2 = Symbol("abc");
console.log(Symbol.for("abc") === Symbol.for("abc")) // true
```
Symbol.keyFor该方法传入一个 symbol 值，返回该值在全局注册的键名：
``` ts
const sym = Symbol.for("abc"); // Symbol(abc)
console.log(Symbol.keyFor(sym)); // 'abc'
```

内置的 Symbol 值

当对象使用 instanceof 判断是否为这个对象的实例时，就是调用的 Symbol.hasInstance。

ES6 提供了 11 个内置的 Symbol 值，可自行搜索查看。
:::


### 对象类型
> `{}` 或者 `object`,  `[]` 或者 `Array<any>`, 和 `function`, `Class` 类型

#### object 或 {}
``` ts
// 字面量创建
const obj: {} = {};
// 构造函数创建
const obj1: Object = {};
// ? 表示可选属性，默认规则是可选属性一定是在必选属性之后
const obj2: { msg: string; num?: number } = { msg: "msg", num: 1 };
// 函数的参数是对象
function getKeys(obj: object) {
  return Object.keys(obj);
}
```

::: tip {}、object 和 Object
- object 类型他表示非原始对象，可以给它分配对象和数组，但不能分配原始类型的数据：

`(number，string，boolean，symbol，null或undefined 在JavaScript中为原始类型)`
``` ts
var o: object;
o = { prop: 0 }; // OK
o = []; // OK
o = 42; // Error
o = "string"; // Error
o = false; // Error
o = null; // Error
o = undefined; // Error
```

- Object 类型是所有 Object 类的实例的类型，包含了 js 原始的所有公用的功能：
``` ts
var p: {}; // or Object
p = { prop: 0 }; // OK
p = []; // OK
p = 42; // OK
p = "string"; // OK
p = false; // OK
p = null; // Error
p = undefined; // Error
```

- { [key: string]: any } 是更具体的，类似于 object
可以给它分配对象和数组，但不能分配原始类型的数据：
``` ts
var q: { [key: string]: any };
q = { prop: 0 }; // OK
q = []; // OK
q = 42; // Error
q = "string"; // Error
q = false; // Error
q = null; // Error
q = undefined; // Error
```

- { [key: string]: string } 是最具体的，它不允许任何原始类型、数组或具有非字符串值的对象被分配到它：
``` ts
var r: { [key: string]: string };
r = { prop: 'string' }; // OK
r = { prop: 0 }; // Error
r = []; // Error
r = 42; // Error
r = "string"; // Error
r = false; // Error
r = null; // Error
r = undefined; // Error
```
:::

#### Array<any> 或 []
``` ts
// 字面量创建
const arr: [] = [];
// string 指定的是数组元素的类型
const arr1: string[] = ["a"];
// 如果你要指定一个数组里的元素既可以是数值也可以是字符串 使用联合类型
const arr2: (string | number)[] = ["b", 2];
// 构造函数创建, Aarry 必须传入一个类型参数
const arr4: Array<string> = ["a", "b"];
// 也可以使用联合类型
const arr5: Array<string | number> = ["a", 1];

// 存储对象类型的内容
const objectArr: { name: string; age: number }[] = [
  { name: 'zs', age: 18 }
]

// 使用类型别名(type alias)
type User = { name: string; age: number }
// 存储对象类型的内容
const objectArr: User[] = [
  { name: 'ls', age: 18 }
]
```


