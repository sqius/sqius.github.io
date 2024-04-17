# TypeScript-相关概念

## 📄 TypeScript
[TypeScript](https://www.typescriptlang.org/)：是 JavaScript 的超集，拥有类型机制，不能在浏览器直接执行，而是编译成 JavaScript 后才会运行。

- 超集（superset）：比如 ES6 包含了 ES5 所有的内容，还有一些独特的语法特性，就可以理解为 ES6 是 ES5 的超集。
- 类型：js 中一个存放字符串的变量，后续依旧可以将数字、对象、数组等类型赋值到该变量，这是动态类型。
- 而 ts 则是静态类型，后续不可更改类型。

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

#### 📄 常见推断
类型推断(type inference)，TS 会自动的去尝试分析变量的类型。
``` ts
// 这就是典型的类型推断，它们的类型是 number 而且值永远都不会变：
const number1 = 1;
const number2 = 2;
const number3 = number1 + number2;
```

#### 📄 联合类型
当定义一个数组或元组这种包含多个元素的值的时候，多个元素可以有不同的类型，这时候 TypeScript 会将多个类型合并起来，组成一个联合类型：
``` ts
let arr = [1, "a"]; // arr 的元素被推断为 string | number
arr = ["b", 2, false]; // error 不能将类型“boolean”分配给类型“string | number”。

let value = Math.random() * 10 > 5 ? "abc" : 123; // value 的类型被推断为 string | number
value = false; // error 不能将类型“boolean”分配给类型“string | number”。
```

#### 📄 下文类型
下文类型与上面根据 `=` 右边值的类型，推断左侧值的类型的情况正好相反。
下文类型是 根据左侧的类型推断右侧的一些类型
``` ts
window.onmousedown = function (mouseEvent) { // mouseEvent 的类型被推断为 MouseEvent
  console.log(mouseEvent.a); // 类型“MouseEvent”上不存在属性“a”。
};
```

## 📄 类型注解
类型注解(type annotation) ，告诉 TS 变量是什么类型。
``` ts
// 当 TS 无法推断出变量类型的时候需要添加类型注解:
function getTotal(number1: number, number2: number) {
  return number1 + number2;
}
const total = getTotal(1, 2);

interface Person {
  name: string;
}
const person: Person = { name: "ZS" };

let temp: number | string = 123;
temp = "456";
```

## 📄 静态类型
- JavaScript 运行时才会进行类型检查，会导致运行时的错误 它是动态类型。
- TypeScript 是静态类型 在运行前需要先编译为 JavaScript，而在编译阶段就会进行类型检查。
``` ts
let foo = 1; // 这里根据类型推断，可以省略 :number
foo.split(","); // Error 类型“number”上不存在属性“split”。

// 支持 数字类型的所有方法
foo.toFixed()
foo.toString()
```


## 📄 类型断言
TypeScript 允许你覆盖它的推断，并且能以你任何你想要的方式分析它，这种机制被称为「类型断言」

> 类型断言 之所以不被称为「类型转换」，是因为转换通常意味着某种运行时的支持。
> 但是，类型断言纯粹是一个编译时语法，同时，它也是一种为编译器提供关于如何分析代码的方法。
``` ts
const foo = {};
foo.a = 123; // Error 类型“{}”上不存在属性“a”。
foo.b = 'hello'; // Error 类型“{}”上不存在属性“b”
```

#### 📄 `as` 运算符
``` ts
// 可以通过类型断言来避免此问题：
interface Foo {
  a: number;
  b: string;
}

const foo = {} as Foo;
foo.a = 123;
foo.b = "hello";
```

#### 📄 `<type>value` 写法
``` ts
const foo = <Foo>{}
foo.a = 123;
foo.b = "hello";
```


::: tip
当你在 JSX 中使用 <foo> 的断言语法时，这会与 JSX 的语法存在歧义。
因此，为了一致性， 建议使用 as 的语法来为类型断言。
``` ts
const getStrLength = (target: string | number): number => {
  // 这种形式在JSX代码中不可以使用，而且也是TSLint不建议的写法
  if ((<string>target).length) {
    // 这种形式是没有任何问题的写法，所以建议始终使用这种形式
    return (target as string).length;
  } else {
    return target.toString().length;
  }
};
```
:::

::: warning
在很多情景下，断言能让你更容易的从遗留项目中迁移（甚至将其他代码粘贴复制到你的项目中），然而，你应该小心谨慎的使用断言。
``` ts
interface Foo {
  a: number;
  b: string;
}

const foo = <Foo>{
  // 编译器将会提供关于 Foo 属性的代码提示
  // 但是开发人员也很容易忘记添加所有的属性
  // 同样，如果 Foo 被重构，这段代码也可能被破坏（例如，一个新的属性被添加）。
};


// 使用一种更好的方式：
const foo: Foo = {
  // 编译器将会提供 Foo 属性的代码提示
};
```
在某些情景下，你可能需要创建一个临时的变量，但至少，你不会使用一个承诺（可能是假的），而是依靠类型推断来检查你的代码。
:::

## 📄 类型保护
TypeScript 能够在特定的区块(类型保护区块)中保证变量属于某种特定的类型。

可以在此区块中放心地引用此类型的属性，或者调用此类型的方法。

``` ts
const valueList = [123, "abc"];

const getRandomValue = () => {
  const number = Math.random() * 10; // 这里取一个[0, 10)范围内的随机值
  if (number < 5) return valueList[0]; // 如果随机数小于5则返回valueList里的第一个值，也就是123
  else return valueList[1]; // 否则返回"abc"
};
```

上面的 `getRandomValue` 在TS中，无法推测item的类型，所以报错:
``` ts
const item = getRandomValue();

if (item.length) {
  // error 类型“number”上不存在属性“length”
  console.log(item.length); // error 类型“number”上不存在属性“length”
} else {
  console.log(item.toFixed()); // error 类型“string”上不存在属性“toFixed”
}
```

这里可以使用类型断言：

``` ts
if ((<string>item).length) {
  console.log((<string>item).length);
} else {
  console.log((<number>item).toFixed());
}
```

类型保护的三种方法:
- 自定义类型保护
- typeof 类型保护
- Instanceof 类型保护

#### 📄 自定义类型保护
通过定义一个返回值类型是 `参数名 is type` 的语句，来指定传入这个类型保护函数的某个参数是什么类型。
``` ts
function isString(value: number | string): value is string {
  const number = Math.random() * 10
  return number < 5;
}
const item = getRandomValue();

if (isString(item)) {
  console.log(item.length); // 此时item是string类型
} else {
  console.log(item.toFixed()); // 此时item是number类型
}
```

#### 📄 typeof 类型保护
只需要在 if 的判断逻辑地方使用 typeof 关键字即可判断一个值的类型。
``` ts
const item = getRandomValue();
if (typeof item === "string") {
  console.log(item.length);
} else {
  console.log(item.toFixed());
}
```

::: tip
TS 中，对 typeof 的处理还有些特殊要求：
- 只能使用 = 和 ! 两种形式来比较，比如使用(typeof item).includes('string')也能做判断，但是不准确；
- type 只能是 number、string、boolean 和 symbol 四种类型;
- typeof的缺点：typeof xxx的结果还有object、function和 undefined，像数组与对象就不能很好的区分;

:::

#### 📄 Instanceof 类型保护
JS 中的原生操作符，它用来判断一个实例是不是某个构造函数创建的，或者是不是使用 ES6 语法的某个类创建的。

在 TS 中，使用 instanceof 操作符同样会具有类型保护效果。

``` ts
class CreateByClass1 {
  public age = 18;
  constructor() {}
}
class CreateByClass2 {
  public name = "zs";
  constructor() {}
}

function getRandomItem() {
  // 如果随机数小于0.5就返回CreateByClass1的实例，否则返回CreateByClass2的实例
  return Math.random() < 0.5 ? new CreateByClass1() : new CreateByClass2();
}

const item = getRandomItem();

// 这里判断item是否是CreateByClass1的实例
if (item instanceof CreateByClass1) {
  console.log(item.age);
} else {
  console.log(item.name);
}
```

## 📄 类型兼容

#### 📄 函数参数个数
> 如果对函数 y 进行赋值，那么要求 x 中的每个参数都应在 y 中有对应，也就是 x 的参数个数小于等于 y 的参数个数。
``` ts
let x = (a: number) => 0;
let y = (b: number, c: string) => 0;

y = x; // success
x = y; // error Type '(b: number, s: string) => number' is not assignable to type '(a: number) => number。Target signature provides too few arguments. Expected 2 or more, but got 1.
```

#### 📄 函数参数类型
> 其实和基本的赋值兼容性没差别，只不过比较的不是变量之间而是参数之间。
``` ts
let x = (a: number) => 0;
let y = (b: string) => 0;
let z = (c: string) => false;
x = y; // error 不能将类型“(b: string) => number”分配给类型“(a: number) => number”。
x = z; // error 不能将类型“(c: string) => boolean”分配给类型“(a: number) => number”。
```

#### 📄 剩余参数和可选参数
> 当要被赋值的函数参数中包含剩余参数（…args）时，赋值的函数可以用任意个数参数代替，但是类型需要对应，可选参数效果相似。
``` ts
const getNum = (
  arr: number[],
  callback: (arg1: number, arg2?: number) => number // 这里指定第二个参数callback是一个函数，函数的第二个参数为可选参数
): number => {
  return callback(...arr); // error 应有 1-2 个参数，但获得的数量大于等于 0
};
```

#### 📄 函数参数双向协变
> 参数类型无需绝对相同
``` ts
let funcA = function(arg: number | string): void {};
let funcB = function(arg: number): void {};
funcB = funcA // Success
```

#### 📄 函数返回值类型
> 和函数参数类型的兼容性差不多，都是基础的类型比较。
``` ts
let x = (a: number): string | number => 0;
let y = (b: number) => "a";
let z = (c: number) => false;
x = y;
x = z; // 不能将类型“(c: number) => boolean”分配给类型“(a: number) => string | number”
```

#### 📄 重载函数
> 要求被赋值的函数每个重载都能在用来赋值的函数上找到对应的签名
``` ts
function merge(arg1: number, arg2: number): number; // 这是merge函数重载的一部分
function merge(arg1: string, arg2: string): string; // 这也是merge函数重载的一部分
function merge(arg1: any, arg2: any) { // 这是merge函数实体
  return arg1 + arg2;
}
function sum(arg1: number, arg2: number): number; // 这是sum函数重载的一部分
function sum(arg1: any, arg2: any): any { // 这是sum函数实体
  return arg1 + arg2;
}
let func = merge;
func = sum; // error 不能将类型“(arg1: number, arg2: number) => number”分配给类型“{ (arg1: number, arg2: number): number; (arg1: string, arg2: string): string; }”
```
> sum函数的重载缺少参数都为string返回值为string的情况，与merge函数不兼容

#### 📄 枚举
> 数字枚举成员类型与数值类型兼容，字符串枚举成员与字符串类型不兼容
``` ts
enum Status {
  On,
  Off
}
enum Color {
  White,
  Black
}
let s = Status.On;
s = Color.White; // Error 不能将类型“Color.White”分配给类型“Status”

s = 'zs' // Error 不能将类型“"zs"”分配给类型“Status”
```

#### 📄 类
- 类 在类型比较兼容性时，只比较实例的成员。

> 这两个变量虽然类型是不同的类类型，但是它们都有相同字段和类型的实例属性name，而类的静态成员是不影响兼容性的，所以它俩兼容。而类Food定义了一个实例属性name，类型为number，所以类型为Food的f与类型为Animal的a类型不兼容，不能赋值:

``` ts
class Animal {
  static age: number;
  constructor(public name: string) {}
}
class People {
  static age: string;
  constructor(public name: string) {}
}
class Food {
  constructor(public name: number) {}
}
let a: Animal;
let p: People;
let f: Food;
a = p; // right
a = f; // Error Type 'Food' is not assignable to type 'Animal'
```

- 类的私有成员和受保护成员会影响兼容性。

> 当检查类的实例兼容性时，如果目标（也就是要被赋值的那个值）类型（这里实例类型就是创建它的类）包含一个私有成员，那么源（也就是用来赋值的值）类型必须包含来自同一个类的这个私有成员，这就允许子类赋值给父类。

> 当指定 other 为 Parent 类类型，给 other 赋值 Other 创建的实例的时候，会报错。因为 Parent 的 age 属性是私有成员，外界是无法访问到的，所以会类型不兼容。
> 使用 protected 受保护修饰符修饰的属性，也是一样:

``` ts
class Parent {
  private age: number;
  constructor() {}
}
class Children extends Parent {
  constructor() {
    super();
  }
}
class Other {
  private age: number;
  constructor() {}
}

const children: Parent = new Children();
const other: Parent = new Other(); // 不能将类型“Other”分配给类型“Parent”。类型具有私有属性“age”的单独声明
// protected age: number; // 不能将类型“Other”分配给类型“Parent”。属性“age”受保护，但类型“Other”并不是从“Parent”派生的类
```