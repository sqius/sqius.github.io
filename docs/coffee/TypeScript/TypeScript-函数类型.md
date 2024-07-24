# TypeScript - 函数类型
一个函数的定义包括函数名、参数、逻辑和返回值。

## 📄 基本用法

#### 📄 直接定义类型与返回值
- 普通函数
``` ts
function addFun(arg1: number, arg2: number): number {
  return arg1 + arg2;
}

```
- 箭头函数
``` ts
const addFun = (arg1: number, arg2: number): number => {
  return arg1 + arg2;
};
```

- 匿名函数
``` ts
let addFun: (arg1: number, arg2: number) => number;
addFun = function (arg1, arg2) {
  return arg1 + arg2;
};
addFun = (arg1, arg2) => {
  return arg1 + arg2;
};
```

::: tip
- 如果省略参数的类型，`TypeScript` 会默认这个参数是 `any` 类型；
- 如果省略返回值的类型：
  - 如果函数无返回值，那么 `TypeScript` 会默认函数返回值是 `void` 类型；
  - 如果函数有返回值，那么 `TypeScript` 会根据我们定义的逻辑推断出返回类型。

:::

#### 📄 使用接口
``` ts
interface AddFun {
  (x: number, y: number): number;
}
let addFun: AddFun = (arg1: string, arg2: string): string => arg1 + arg2;
// error 不能将类型“(arg1: string, arg2: string) => string”分配给类型“AddFun”
```

#### 📄 使用类型别名
``` ts
type AddFun = (x: number, y: number) => number;
let addFun: AddFun = (arg1: string, arg2: string): string => arg1 + arg2;
// error 不能将类型“(arg1: string, arg2: string) => string”分配给类型“AddFun”
```

## 📄 函数参数

#### 📄 可选参数
- 可选参数 需在参数名后跟随一个 `?`。
``` ts
let add = (arg1: number, arg2?: number): number => arg1 + arg2;
add(1);
add(1, 2);
type AddFun = (x?: number, y: number) => number; // error 必选参数不能位于可选参数后。
```

::: tip
- 可选参数 必须放在必选参数之后；
- 而如果几个参数中，前面的参数是可不传的，后面的参数是需要传的，就需要在该可不传的参数位置传入一个 `undefined` 占位；

:::

#### 📄 默认参数
- 定义函数时 直接在参数后面使用 `=` 连接默认值
``` ts
const addFun = (arg1: number, arg2: number = 2): number => {
  return arg1 + arg2;
};
addFun(1); // 3
```

::: tip
- 带默认值的参数 放在必须参数前后都可以；
- `TypeScript` 会识别默认参数的类型，如果给这个带默认值的参数传了别的类型的参数则会报错；

:::


#### 📄 剩余参数
使用 `ES6` 的 `…` 拓展运算符 用来处理任意数量的参数。
``` ts
const handleArgs = (arg1: number, ...args: number[]) => {
  console.log(args);
};
handleArgs(1, 2, 3, 4, 5); // [ 2, 3, 4, 5 ]
handleArgs(1, "a"); // 类型“string”的参数不能赋给类型“number”的参数
```

::: tip
- `args` 是一个数组, 是除了 `arg1` 之外的所有实参的集合；
- 拓展运算符 可以将一个数组、对象进行拆解。还支持用在函数的参数列表中，用来处理任意数量的参数；

:::

## 📄 函数重载
通过为一个函数指定多个函数类型定义，从而对函数调用的返回值进行检查。
``` ts
// 指定当参数类型为string时，返回值为string类型的元素构成的数组
function handleData(x: string): string[];

// 指定当参数类型为number时，返回值类型为string
function handleData(x: number): string;

// 实体函数 重载内容
function handleData(x: any): any {
  if (typeof x === "string") return x.split("");
  else return x.toString();
}

andleData("abc").join("_");
handleData(123).join("_"); // error 类型"string"上不存在属性"join"
handleData(false); // error 类型"boolean"的参数不能赋给类型"number"的参数。
```

::: tip 函数重载
- 在其他强类型语言中，函数重载是指定义几个函数名相同，但参数个数或类型不同的函数，在调用时传入不同的参数，编译器会自动调用适合的函数（比如Java）。

- `TS`函数重载区别于其他语言中的重载，`TS`中的重载是为了针对不同参数个数和类型，推断返回值类型。

- `TS`函数重载不能使用箭头函数, 重载只能用 `function` 来定义，不能使用接口、类型别名等。

:::
