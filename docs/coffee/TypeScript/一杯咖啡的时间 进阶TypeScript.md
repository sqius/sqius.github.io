# 一杯咖啡的时间 进阶 TypeScript

> 需掌握 TS 基础知识。

## 📄 Tuple 元组
- `Tuple` 表示成员类型可以自由设置的数组，即数组的各个成员的类型可以不同。
- `Tuple` 必须声明每个成员的类型。

``` ts
const value: [number] = [1];
const value1: [string, string, boolean] = ["a", "b", true];
```

- 某些情况下，使用 `元组（Tuple）` 来代替数组要更加妥当，一个数组中只存放固定长度的变量，来防止越界访问。

``` ts
const value1: [string, string, boolean] = ["a", "b", true];
console.log(value1[10]) // error 长度为“3”的元组类型“[string, string, boolean]”在索引“10“处没有元素
```

- 元组也支持了在某一个位置上的可选成员。此时元组的长度属性也会发生变化。

``` ts
const value: [string, number?, boolean?] = ["a"];
// 长度的类型为 1 | 2 | 3
console.log(typeof value.length) // 1 | 2 | 3
```

- 具名元组（Labeled Tuple Elements） 可以为元组中的元素打上类似属性的标记。

``` ts
const value: [name: string, age: number, email?: string] = ['zhangsan', 18];

```

## 📄 Enum 枚举
- 枚举并不是 `JavaScript` 中原生的概念
- 用来将相关常量放在一个容器里面, 常量被真正地约束在一个命名空间下。
- 枚举 可以让你拥有更好的类型提示。
- Enum 成员值都是只读的，不能重新赋值。
- 多个同名的 Enum 结构会自动合并, 合并只允许首成员忽略初始值并且不能有同名成员。
``` ts
enum baseUrl {
  test = "xxx/test/url",
  prev = "xxx/prev/url",
  prod = "xxx/prod/url",
}

enum baseUrl {
  test = 'xxx', // error
  test1 = "xxx/test1/url",
  prev1 = "xxx/prev1/url",
  prod1 = "xxx/prod1/url",
}

// 系统会自动把 baseUrl 合并

baseUrl.test = 'xxx/xxx' // error 无法为“test”赋值，因为它是只读属性
```

- 枚举和对象的重要差异在于，对象是单向映射的，我们只能从键映射到键值。而枚举是双向映射的，即你可以从枚举成员映射到枚举值，也可以从枚举值映射到枚举成员。
- 但是仅有值为数字的枚举成员才能够进行这样的双向枚举，字符串枚举成员仍然只会进行单次映射。
``` ts
enum Color { Red, Green, Blue = 'a', }
const colorValue = Color.Red; // 0
const colorKey = Color[0]; // Red
console.log(Color.Blue) // a
console.log(Color[2]) // undefined
```

- Enum 成员默认不必赋值，系统会从零开始逐一递增，按照顺序为每个成员赋值。
``` ts
enum Color { Red, Green, Blue, } // Red = 0, Green = 1, Blue = 2
```

- 可以设定成员的值，后面成员的值就会从这个值开始递增。
``` ts
enum Color { Red, Green = 100, Blue, } // Red = 0, Green = 100, Blue = 101
```

- 成员的值可以是小数，但不能是 `Bigint`
- 成员的值也可以相同。
``` ts
enum Color {  Red = 90, Blue: 90, Green = 0.5,
  Blue = 7n, // error
}
```

## 📄 Null & Undefined

- 在 `JavaScript` 中，`undefined` 和 `null` 是两个基本数据类型。
- 在 `TypeScript` 中，`null` 与 `undefined` 类型都是有具体意义的类型。
- `null` 与 `undefined` 在没有开启 `strictNullChecks` 检查的情况下，会被视作其他类型的子类型。

``` ts
const value1: null = null;
const value2: undefined = undefined;

const value3: string = null; // 关闭 strictNullChecks 时成立
const value4: string = undefined; // 关闭 strictNullChecks 时成立
```

## 📄 Object & object & {}

- Object：
  - `Object` 类型是所有 `Object` 类的实例的类型，包含了 `js` 原始的所有公用的功能。
  - `Object` 原型链的顶端是 `Object` 和 `Function`。所有的原始类型与对象类型最终都指向 `Object`。
  - 在 `TypeScript` 中就表现为 `Object` 包含了所有的类型。

  ``` ts
  let p: Object;
  p = { prop: 0 }; // OK
  p = []; // OK
  p = 42; // OK
  p = "string"; // OK
  p = false; // OK
  p = null; // Error
  p = undefined; // Error
  ```

- object:
  - `object` 类型表示非原始对象 `（原始类型: number，string，boolean，symbol，null，undefined）`，可以给它分配对象和数组，但不能分配原始类型的数据。
  - `object` 的引入就是为了解决对 `Object` 类型的错误使用。

  ``` ts
  let o: object;
  o = { prop: 0 }; // OK
  o = []; // OK
  o = 42; // Error 值为原始对象
  o = "string"; // Error
  o = false; // Error
  o = null; // Error
  o = undefined; // Error
  ```

- {}:
  - 当使用 `{}` 时 就是一个合法的但是内部无属性定义的空对象，类似于 `Object`。
  - 当使用 `{}` 时  意味着任何非 `null / undefined` 的值。
  - 虽然能够将其作为变量的类型，但你实际上无法对这个变量进行任何赋值操作。

  ``` ts
  var value: {} = { name: 'zhangsan'}
  value.name = '' // error 类型“{}”上不存在属性“name”。
  ```

  - `{ [key: string]: any }` 是更具体的，类似于 `object`。
  - 可以给它分配对象和数组，但不能分配原始类型的数据。
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

  - `{ [key: string]: string }` 是最具体的。
  - 它不允许任何原始类型、数组或具有非字符串值的对象被分配到它。
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

::: tip

- 在任何时候都不要使用 `Object` 以及类似的 `装箱类型`。
- 不确定某个变量的具体类型，但能确定它不是原始类型，可以使用 `object`, 但最好使用 `Record<string, unknown>` 或 `Record<string, any>` 表示这样的对象。
- `{}` 意味着任何非 `null / undefined` 的值。 一定要避免使用。

:::

## 📄 逆变 & 协变
- 协变函数类型的参数类型使用子类型逆变的方式确定是否成立。
- 返回值使用子类型协变的方式确定是否成立。

``` ts
// 在这里，有三个依次派生的类，每个类在上一个类的基础上添加了一个独特的方法
// Corgi 是 Dog 的子类 ，Dog 是 Animal 的子类。
class Animal {
  asPet() {}
}

class Dog extends Animal {
  bark() {}
}

class Corgi extends Dog {
  cute() {}
}
```

- 函数类型的参数类型使用子类型逆变的方式确定是否成立。
> 参数类型允许为 Dog 的父类型，不允许为 Dog 的子类型。

> 参数只能向高接收不能向低接收(逆变)

``` ts
type DogFactory = (args: Animal) => Dog; // ok
// type DogFactory = (args: Corgi) => Dog; // error 类型“Dog”的参数不能赋给类型“Corgi”的参数。

function dogBark(dogFactory: DogFactory) {
  const dog = dogFactory(new Dog());
  dog.bark();
}
```

- 返回值使用子类型协变的方式确定是否成立。
> 返回值类型允许为 Dog 的子类型，不允许为 Dog 的父类型。

> 顺从-返回值只能向下不能向上 (协变)

``` ts
type DogFactory = (args: Dog) => Dog; // ok
// type DogFactory = (args: Dog) => Corgi; // ok
// type DogFactory = (args: Dog) => Animal; // error
function dogBark(dogFactory: DogFactory) {
  const dog = dogFactory(new Dog());
  dog.bark();
}
```

## 📄 字面量类型

- 字面量类型主要包括字符串字面量类型、数字字面量类型、布尔字面量类型和对象字面量类型, 可以直接作为类型标注。
- 字面量类型主代表着比原始类型更精确的类型，同时也是原始类型的子类型。
- 原始类型的值可以包括任意的同类型值，而字面量类型要求的是值级别的字面量一致。

``` ts
let value1 : 'success' | 'error' = 'success'
value1 = 'abc' // error  不能将类型“"abc"”分配给类型“"success" | "error"”

let value2 : 1 = 1
value2 = 2 // error 不能将类型“2”分配给类型“1”。

type vType = { code: 200 | 500; status: "success" | "error"; };
```

## 📄 类型断言
- `as` 类型断言能够显式告知类型检查程序当前这个变量的类型，可以进行类型分析地修正、类型。
- 其实就是一个将变量的已有类型更改为新指定类型的操作。

``` ts
interface Foo { a: number; b: string; }

let foo = {};
foo.a = 123; // error 类型“{}”上不存在属性“a”。
(foo as Foo).b = "hello"; // ok

```

- 使用类型断言时，原类型与断言类型之间差异过大，使用双重断言。
``` ts
const str: string = "abc";

(str as { foo: () => {} }).foo() // error

(str as unknown as { foo: () => {} }).foo(); // ok
```

- 非空断言
- 非空断言其实是类型断言的简化，它使用 `!` 语法。
- 表示标记前面的一个声明一定是非空的（剔除 `null、undefined`）

``` ts
interface Foo { nameArr?: { join?: () => string }; }
const foo: Foo = {}

foo.nameArr.join() // error 不能调用可能是“未定义”的对象。
foo!.nameArr!.join!()  // ok 但运行时可能会报错
```

- 非空断言运行时仍然会保持调用链，因此在运行时可能会报错。
- 可选链: `?`。可选链会在某一个部分收到 `undefined` 或 `null` 时直接短路掉，不会再继续调用。

``` ts
foo?.nameArr?.join?.()
```

## 📄 类型查询
- `TypeScript` 存在两种功能不同的 `typeof` 操作符。
- 在 `JavaScript` 中 `typeof` 操作符 用来检查变量类型。
- 在 `TypeScript` 中 `typeof` 操作符 还可以用于类型查询，即 `Type Query Operator`。
- `Type Query Operator` 返回的是一个 `TypeScript` 类型。

``` ts
const str = "zhangsan";
type Str = typeof str; // 'zhangsan'

const num: number = 1;
type num = typeof num; // number

const obj = { name: "lisi", age: 18 };
type Obj = typeof obj; // { name: string, age: number }

const fun = (a: number, b: number) => {
  return a + b;
};
type Fun = typeof fun; // (a: number, b: number) => number
```

## 📄 索引类型

- 索引签名类型主要指的是在接口或类型别名中，通过以下语法来快速声明一个键值类型一致的类型结构。

``` ts
// 在实现这个类型结构的变量中只能声明字符串类型的键:
interface ObjType { [key: string]: string; }
// 或
type ObjType = { [key: string]: string; }

type ObjType1 = ObjType['a'] // string
```

- 索引签名类型也可以和具体的键值对类型声明并存，但这时这些具体的键值类型也需要符合索引签名类型的声明。

``` ts
type ObjType = {
  [key: string]: string;
  name: string;
  age: number; // error 类型“number”的属性“age”不能赋给“string”索引类型“string”。
};

```

- 可以通过 `keyof` 进行 索引类型查询。

``` ts
type ObjType = {
  status: "success" | "error";
  code: 200 | 500;
  res: string;
};

type ObjKeysType = keyof ObjType; // status | code | res
```

- 可以通过 `obj[expression]` 的来动态访问一个对象属性。
- 其实就是通过键的字面量类型 `expression` 访问这个键对应的键值类型。
```ts
type ObjType = { [key: string]: number; };
type ValueType = ObjType[string]; // number

// or

type ObjType = { name: string; age: number };
type NameType = ObjType["name"]; // string
type AgeType = ObjType["age"]; // number

// or
type PropType = ObjType[keyof ObjType] // string | number
```

- 类型映射
``` ts
type ObjType<T> = {
  [K in keyof T]: T[K];
};

type Foo = {
  name: string;
  age: number;
  male: boolean;
  handler: () => void;
};


type NewObjType = ObjType<Foo>
// { name: string;  age: number; male: boolean; handler:  () => void; }
```

## 📄 条件类型
- 条件类型的语法类似于平时常用的三元表达式。

``` ts
type ResType<T> = T extends string ? "string" : "other";

type Res1 = ResType<"zhangsan">; // "string"
type Res2 = ResType<18>; // "other"
type Res3 = ResType<true>; // "other"

```

- 同三元表达式可以嵌套一样，条件类型中也常见多层嵌套。
``` ts
type ResType<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends null
  ? "null"
  : T extends undefined
  ? "undefined"
  : never;

type Res1 = ResType<"zs">; // string
type Res2 = ResType<18>; // number
type Res3 = ResType<true>; // boolean
```

- 条件类型与泛型的搭配 在函数中来标注他的返回值类型。
``` TS
function Add<T extends number | bigint | string>(x: T, y: T) {
  return x + (y as any);
}

Add(1, 2); // T 填充为 1 | 2
Add("ZS", "AB"); // T 填充为 ZS | AB
```

- 同一基础类型的字面量联合类型，其可以被认为是此基础类型的子类型。
- 用嵌套的条件类型来进行字面量类型到基础类型地提取。
``` ts
type LiteralToPrimitive<T> = T extends number
? number
: T extends bigint
? bigint
: T extends string
? string
: never;

function funAdd2<T extends number | bigint | string>(
  x: T,
  y: T
): LiteralToPrimitive<T> {
  return x + (y as any);
}

const a = funAdd2("zs", "ls"); // string
const b = funAdd2(10n, 10n); // bigint
const c = funAdd2(1, 2); // number
```

## 📄 infer 关键字
- `infer` 意为推断，如 `infer R `中 `R` 就表示 待推断的类型。
- `infer` 只能在条件类型中使用。

``` ts
type ArrayItemType<T> = T extends Array<infer ElementType> ? ElementType : never;

type ArrayItemTypeResult1 = ArrayItemType<[]>; // never
type ArrayItemTypeResult2 = ArrayItemType<string[]>; // string
type ArrayItemTypeResult3 = ArrayItemType<[string, number]>; // string | number

// 提取首尾两个
type ExtractStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...any[],
  infer End
]
  ? [Start, End]
  : T;

type ExtractStartAndEndResult1 = ExtractStartAndEnd<[]>; // []
type ExtractStartAndEndResult2 = ExtractStartAndEnd<[1, 2, 3, 4]>; // [1, 4]

// 调换首尾两个
type SwapStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...infer Left,
  infer End
]
  ? [End, ...Left, Start]
  : T;

type SwapStartAndEndResult1 = SwapStartAndEnd<[]>; // []
type SwapStartAndEndResult2 = SwapStartAndEnd<[1, 2, 3, 4]>; // [4, 2, 3, 1]

// 调换开头两个
type SwapFirstTwo<T extends any[]> = T extends [
  infer Start1,
  infer Start2,
  ...infer Left
]
  ? [Start2, Start1, ...Left]
  : T;

type SwapFirstTwoResult1 = SwapFirstTwo<[]>; // []
type SwapFirstTwoResult2 = SwapFirstTwo<[1, 2, 3, 4]>; // [2, 1, 3, 4]

```

## 📄 工具类型

- Partial: 将所有属性变为可选属性。
- `type Partial<T> = { [P in keyof T]?: T[P]; };`

``` ts
type UserType = { name: string; age: number; email: string; };

type PartialUserType = Partial<UserType>;
// type PartialUserType = {
//   name?: string | undefined;
//   age?: number | undefined;
//   email?: string | undefined;
// }
```

- Required: 将所有属性变为必选属性。
- `type Required<T> = { [P in keyof T]-?: T[P]; };`
``` ts
type RequiredUserType = Required<PartialUserType>;
// type RequiredUserType = {
//   name: string;
//   age: number;
//   email: string;
// }
```

- Readonly: 将所有属性变为只读属性。
- `type Readonly<T> = { readonly [P in keyof T]: T[P]; };`

``` ts
type ReadonlyUserType = Readonly<PartialUserType>;
const user: ReadonlyUserType = {};
user.name = "lisi"; // error 无法为“name”赋值，因为它是只读属性。

```

- Pick: 提取对应属性。
- `type Pick<T, K extends keyof T> = { [P in K]: T[P]; };`
``` ts
type PickUserTYpe = Pick<UserType, "name">;
// type PickUserTYpe = {
//   name: string;
// }
```

- Omit: 剔除对应属性。
- `type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;`
``` ts
type OmitUserTYpe = Omit<UserType, "name">;
// type OmitUserTYpe = {
//   age: number;
//   email: string;
// }
```

- Record: 通常我们使用这两者来代替 object。
- `type Record<K extends keyof any, T> = { [P in K]: T; };`
``` ts
type DataType = Record<string, number>
// type DataType = {
//   [x: string]: number;
// }
```

- Parameters: 参数类型。
- `type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;`

``` ts
type FunType = (a: string, b: number) => string;

type ParametersFunType = Parameters<FunType>;
// type ParametersFunType = [a: string, b: number]
```

- ReturnType: 返回类型。
- `type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;`
``` ts
type ReturnTypeFunType = ReturnType<FunType>;
// type ReturnTypeFunType = string | boolean
```

- Extract: 交集。
- `type Extract<T, U> = T extends U ? T : never;`
``` ts
type ExtractType = Extract<1 | 2 | 3, 1 | 2 | 5>;
// type ExtractType = 1 | 2
```

- Exclude: 差集。
- `type Exclude<T, U> = T extends U ? never : T;`
``` ts
type ExcludeType = Exclude<1 | 2 | 3, 1 | 2 | 5>;
// type ExcludeType = 3
```

