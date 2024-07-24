# TypeScript-any & never & void & unknown

## 📄 any 任意类型
有时，我们在编写代码的时候，并不能清楚地知道一个值到底是什么类型，这时就需要用到 `any` 类型，即任意类型；
``` ts
let a: any;
a = 111;
a = "111";
a = () => {};
a = [];
a = {};
a = undefined;
a = null;
```

## 📄 void 没有类型
`void` 和 `any` `相反，any` 是表示任意类型，而 `void` 是表示没有任意类型，就是什么类型都不是；
``` ts
let b: void;
b = 111; // Error 不能将类型“number”分配给类型“void”。
b = "111"; // Error 不能将类型“string”分配给类型“void”。
b = () => {}; // Error 不能将类型“() => void”分配给类型“void”。
b = {}; // Error 不能将类型“{}”分配给类型“void”。
b = []; // Error never[]”分配给类型“void”。
b = null; //Error 不能将类型“null”分配给类型“void”
b = undefined; // OK
```

::: tip
`void` 类型的变量只能赋值为 `undefined` 其他类型不能赋值给 `void` 类型的变量。
:::

## 📄 never 永不存在的值的类型
它是那些总会抛出异常或根本不会有返回值的函数表达式的返回值类型。

当变量被永不为真的类型保护所约束时，该变量也是 `never` 类型。

``` ts
interface Foo {
  type: "foo";
}

interface Bar {
  type: "bar";
}

type All = Foo | Bar;

// TS 是可以收窄类型的 (discriminated union)
// 如果一切逻辑正确，那么这里应该能够编译通过。
function handleValue(val: All) {
  switch (val.type) {
    case "foo":
      // val 被收窄为 Foo
      break;
    case "bar":
      // val 被收窄为 Bar
      break;
    default:
      // val 在这里是 never
      const exhaustiveCheck: never = val
      break;
  }
}

// 有一天你的同事改了 All 的类型：
// type All = Foo | Bar | Baz
// 然而他忘记了在 handleValue 里面加上针对 Baz 的处理逻辑，
// 这个时候在 default branch 里面 val 会被收窄为 Baz，导致无法赋值给 never，产生一个编译错误。
```

::: tip
在 `default` 里面我们把被收窄为 `never` 的 `val` 赋值给一个显式声明为 `never` 的变量。

通过这个办法，你可以确保 `handleValue` 总是穷尽 (exhaust) 了所有 `All` 的可能类型。

`never` 的主要作用：限制类型、控制流程、类型运算。
:::


## 📄 unknown 未知类型
`unknown` 类型是 `TypeScript在3.0` 版本新增的类型，它表示未知的类型。

- 任何类型的值都可以赋值给 `unknown` 类型；
``` ts
let c: unknown;
c = 111;
c = "111";
c = [];
c = {};
c = () => {};
c = undefined;
c = null;

// 流程控制
if (typeof c === 'number') {
  c.toFixed(2);
} else if (typeof c === 'object' && c instanceof Array) {
  c.join('-')
}
```
- 如果没有类型断言或基于控制流的类型细化时，`unknown` 不可以赋值给 `其它类型`，这时它只能赋值给 `unknown` 和 `any` 类型；
``` ts
let value1: any
let value2: unknown;
let value3: string = value2; // error 不能将类型“unknown”分配给类型“string”
value1 = value2
```

- 如果没有类型断言或基于控制流的类型细化，则不能在它上面进行任何操作；
``` ts
let value4: unknown;
value4++; // error “value4”的类型为“未知”。
value4--; // error “value4”的类型为“未知”。
value4 += 1; // error “value4”的类型为“未知”。
```

- `unknown` 与任何 `其它类型` 组成的 `交叉类型`，最后都等于 `其它类型`；
``` ts
type type1 = unknown & string; // type1 => string
type type2 = number & unknown; // type2 => number
type type3 = unknown & unknown; // type3 => unknown
type type4 = unknown & string[]; // type4 => string[]
```

- `unknown` 与任何 `其它类型` 组成的 `联合类型`，都等于 `unknown` 类型；
但只有 `any` 例外，`unknown` 与 `any` 组成的联合类型等于 `any`；
``` ts
type type5 = string | unknown; // type5 => unknown
type type6 = number[] | unknown; // type6 => unknown
type type7 = any | unknown; // type7 => any
```

- `never` 类型是 `unknown` 的子类型；
``` ts
type type8 = never extends unknown ? true : false; // type8 => true
```

- `keyof unknown` 等于类型 `never`
``` ts
type type9 = keyof unknown; // type9 => never
```

- 只能对 `unknown` 进行等或不等操作，不能进行其它操作；
``` ts
value1 === value2;
value1 !== value2;
value1 += value2; // error
```

- `unknown` 类型的值不能访问其属性、作为函数调用和作为类创建实例；
``` ts
let value5: unknown;
value5.age; // error “value5”的类型为“未知”。
value5(); // error “value5”的类型为“未知”。
new value5(); // error “value5”的类型为“未知”。
```

- 使用映射类型时如果遍历的是 `unknown` 类型，则不会映射任何属性；
``` ts
type Types<T> = { [P in keyof T]: number };
type type10 = Types<any>; // type10 => { [x: string]: number }
type type11 = Types<unknown>; // type10 => {}
```

::: tip
我们在实际使用中，如果有类型无法确定的情况，要尽量避免使用 `any`。

这三个式子都不会报错，因为 `tmp` 是 `any` 类型：
``` ts
let tmp: any
console.log(tmp.name) // 当 tmp 是一个对象时，访问name属性是没问题的
console.log(tmp.toFixed())  // 当 tmp 是数值类型的时候，调用它的toFixed方法没问题
console.log(tmp.length) // 当 tmp 是字符串或数组时获取它的length属性是没问题
```
当你指定值为 `unknown` 类型的时候，但是没有通过基于控制流的类型断言来缩小范围，是不能对它进行任何操作的；

所以 `unknown` 相比于 `any` 是安全的！
:::