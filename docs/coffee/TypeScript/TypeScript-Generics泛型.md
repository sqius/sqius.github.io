# TypeScript-Generics 泛型


## 📄 定义
- 泛型：在定义函数、接口或类的时候不预先指定数据类型，而是在使用时再指定类型的 特性。

``` ts
// before
const pushStrArr = (arr: string[], item: string): string[] => {
  arr.push(item);
  return arr;
};

const pushNumArr = (arr: number[], item: number): number[] => {
  arr.push(item);
  return arr;
};

// after
// 这个 T 在这次函数定义中就代表某一种类型，它可以是基础类型，也可以是联合类型等高级类型
const pushArr = <T>(arr: T[], item: T): T[] => {
  arr.push(item);
  return arr;
};

pushArr<number>([1, 2, 3, 4], 5);
pushArr<string>(["a", "b", "c", "d"], "e");

```

> 在调用 pushArr 的时候，在方法名后面使用<>传入了 泛型变量 T 的类型number，那么在定义 pushArr 函数时使用 T 指定类型的地方，都会使用number指定。



## 📄 泛型变量
- 泛型变量，这是一种特殊的变量，只用于表示类型而不是值。
> 其实可以把这个 T U 当作是一个 所有的可能 的一种类型，这个类型是使用者决定的。
``` ts
function swapGeneric<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]]
}

const result2 = swapGeneric(['string', 0.123])

// ts的类型推断系统能够明确得知第一个元素会是数值，而第二个元素会是字符串
result2[0].toFixed(2)
result2[1].toLocaleUpperCase()
```

## 📄 泛型约束
- 属性约束

使用一个类型和extends对泛型进行约束。
``` ts
// 使用接口定义一个对象必须有哪些属性：
interface ValueWithLength {
  length: number;
}
const getLength = <T extends ValueWithLength>(param: T): number => {
  return param.length;
};

getLength("abc"); // 3
getLength([1, 2, 3]); // 3
getLength({ length: 3 }); // 3

getLength(123); // 类型“number”的参数不能赋给类型“ValueWithLength”的参数。
```

- 类型参数约束

当定义一个对象，想要对 只能访问对象上存在的属性 做要求时 比如：
``` ts
const getProps = (object, propName) => {
  return object[propName];
};
const obj = { a: "aa", b: "bb" };
getProps(obj, "c"); // undefined 访问这个对象的c属性时，这个属性是没有的
```

需要用到索引类型keyof结合泛型来实现对这个问题的检查：
``` ts
const getProp = <T, K extends keyof T>(object: T, propName: K) => {
  return object[propName];
};

const obj = { a: "aa", b: "bb" };

// 在这里 K 就被约束为了只能是"a"或"b"
getProp(obj, "c"); // 类型“"c"”的参数不能赋给类型“"a" | "b"”的参数
```

可以理解为keyof 的T相当于一个由泛型变量T的属性名构成的联合类型。

## 📄 泛型函数
- 简单定义
``` ts
const getArray: <T>(arg: T, times: number) => T[] = (arg, times) => {
  return new Array(times).fill(arg);
};
```

- 使用类型别名
``` ts
type GetArray = <T>(arg: T, times: number) => T[];
const getArray: GetArray = <T>(arg: T, times: number): T[] => {
  return new Array(times).fill(arg);
};
```


- 使用接口
```ts
interface GetArray {
  <T>(arg: T, times: number): T[];
}
const getArray: GetArray = <T>(arg: T, times: number): T[] => {
  return new Array(times).fill(arg);
};
```

## 📄 泛型类
- 定义一个类，实现被 push 入的队列元素与 pop 出的元素的类型一致:
``` ts
class Queue<T> {
  private data: T[] = [];
  push(item: T) {
    return this.data.push(item);
  }
  pop(): T | undefined {
    return this.data.pop();
  }
}

//泛型类实例化时要指定具体的类型
const queue = new Queue<number>();
queue.push(1);
queue.push("str"); // Error: 类型“string”的参数不能赋给类型“number”的参数。
```

## 📄 泛型接口
- 泛型接口描述的对象:
```ts
interface KeyPair<T, U> {
  key: T
  value: U
}

let kp1: KeyPair<number, string> = { key: 123, value: 'str' }
let kp2: KeyPair<string, number> = { key: 'test', value: 123 }
```

- 泛型接口的描述函数
``` ts
interface Plus<T> {
  // 函数应具有两个形参，和一个返回值，它们的类型相同
  (a: T, b: T): T;
}

function plus(a: number, b: number): number {
  return a + b;
}
function concat(a: string, b: string): string {
  return a + b;
}

const a: Plus<number> = plus;
const b: Plus<string> = concat;

const c: Plus<number> = concat; // 不能将类型“(a: string, b: string) => string”分配给类型“Plus<number>”。 参数“a”和“a” 的类型不兼容。
```
