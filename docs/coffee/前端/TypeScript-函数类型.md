# TypeScript - 函数类型

## 📄 函数类型
一个函数的定义包括函数名、参数、逻辑和返回值。

- 如果省略参数的类型，TypeScript 会默认这个参数是 any 类型；
- 如果省略返回值的类型：
  - 如果函数无返回值，那么 TypeScript 会默认函数返回值是 void 类型；
  - 如果函数有返回值，那么 TypeScript 会根据我们定义的逻辑推断出返回类型。

- 可选参数必须放到选参数之后；
- 如果几个参数中，前面的参数是可不传的，后面的参数是需要传的，就需要在该可不传的参数位置传入一个 undefined 占位。
``` ts
// 普通函数
function addFun1(arg1: number, arg2: number): number {
  return arg1 + arg2;
}

// 箭头函数
const addFun2 = (arg1: number, arg2: number): number => {
  return arg1 + arg2;
};

// 匿名函数
let addFun3: (arg1: number, arg2: number) => number;
addFun3 = function (arg1, arg2) {
  return arg1 + arg2;·
};
const addFun4: (arg1: number, arg2: number) => number = (arg1, arg2) => {
  return arg1 + arg2;
};

// 使用Interface
interface addFun5 {
  (x: number, y: number): number;
}
let add: addFun5 = (arg1: string, arg2: string): string => arg1 + arg2;
// error 不能将类型“(arg1: string, arg2: string) => string”分配给类型“addFun5”

// 使用类型别名
type addFun6 = (x: number, y: number) => number;
let add: addFun6 = (arg1: string, arg2: string): string => arg1 + arg2;
// error 不能将类型“(arg1: string, arg2: string) => string”分配给类型“addFun6”

// 可选参数
let add: addFun7 = (arg1: number, arg2?: number): string => arg1 + arg2;
add(1)
type addFun7 = (x?: number, y: number) => number; // error 必选参数不能位于可选参数后。

// 剩余参数
const handleArgs = (arg1: number, ...args: number[]) => {
};
handleArgs(1, "a"); // error 类型"string"的参数不能赋给类型"number"的参数

// 函数重载
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
在其他一些强类型语言中，函数重载是指定义几个函数名相同，但参数个数或类型不同的函数，在调用时传入不同的参数，编译器会自动调用适合的函数（比如Java）。

TS函数重载区别于其他语言中的重载，TypeScript中的重载是为了针对不同参数个数和类型，推断返回值类型。

TS函数重载不能使用箭头函数!!!
:::
