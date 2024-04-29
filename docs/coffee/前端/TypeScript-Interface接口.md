# TypeScript-Interface 接口
接口是一系列抽象方法的声明，是一些方法特征的集合，这些方法都应该是抽象的，需要由具体的类去实现，然后第三方就可以通过这组抽象方法调用，让具体的类执行具体的方法。

基础类型只是定义了简单的类型定义，而接口可以定义几乎任意结构（复杂结构）
## 📄 基本用法

#### 📄 基础用法
``` ts
interface Point {
  x: number;
  y: number;
}

declare const myPoint: Point;
```

- TypeScript 接口是开放式的，这是 TypeScript 的一个重要原则，它允许你使用接口来模仿 JavaScript 的可扩展性。
> 由于TypeScript的声明合并策略，会将同名的一些可合并的声明进行合并，当同名的两个值或类型不能合并的时候，或者可以合并的两个同名的值不符合要求，就会报错；
``` ts
// Lib a.d.ts
interface Point {
  x: number,
  y: number
}
declare const myPoint: Point

// Lib b.d.ts
interface Point {
  z: number
}

// Your code
myPoint.z // Allowed!
```

::: tip
- Interface 不是定义一个对象，可以理解为 是一个代码块。其中的声明语句声明的是类型而不是变量的值；
- 声明不使用等号，而是冒号指定类型；
- 每条声明之前用换行分隔即可，换行符可以是 分号 也可以是 逗号。

:::

#### 📄 函数类型
- 描述函数类型 由带有参数类型和返回值类型组成
``` ts
interface AddFun {
  (num1: number, num2: number): number;
}

const add: AddFun = (num1, num2) => num1 + num2;
const join: AddFun = (num1, num2) => `${num1} ${num2}`; // 不能将类型“string”分配给类型“number”。
add("1", 2); // 类型“string”的参数不能赋给类型“number”的参数。
```

#### 📄 索引类型
- 描述索引以及索引对应值的类型
``` ts
interface RoleDic {
  [id: number]: string;
}

const role1: RoleDic = {
  0: "super_admin",
  1: "admin",
};

const role2: RoleDic = {
  s: "super_admin", // 不能将类型"{ s: string; a: string; }"分配给类型"RoleDic"。
  a: "admin",
};

const role3: RoleDic = ["super_admin", "admin"];
```

- 也可以给索引设置`readonly`，从而防止索引返回值被修改。
``` ts
interface RoleDic {
  readonly [id: number]: string;
}

const role: RoleDic = {
  0: "super_admin"
};

role[0] = "admin"; // error 类型"RoleDic"中的索引签名仅允许读取
```

#### 📄 接口继承
接口继承相当于复制接口的所有成员（属性）。

- 使用extends 关键词继承。
``` ts
interface Vegetables {
  color: string;
}
interface Tomato extends Vegetables {
  radius: number;
}
interface Carrot extends Vegetables {
  length: number;
}
const tomato: Tomato = {
  // 类型 "{ radius: number; }" 中缺少属性 "color"，但类型 "Tomato" 中需要该属性。
  radius: 1.2,
};
const carrot: Carrot = {
  color: "orange",
  length: 20,
};
```
- 一个接口可以被多个接口继承，同样，一个接口也可以继承多个接口，多个接口用逗号隔开。
``` ts
interface Vegetables {
  color: string;
}
interface Food {
  type: string;
}
interface Tomato extends Food, Vegetables {
  radius: number;
}

const tomato: Tomato = {
  type: "vegetables",
  color: "red",
  radius: 1.2
};
```

#### 📄 混合类型
- 包含函数与属性的类型。函数是对象类型，对象可以有属性，所以有时对象即是一个函数，也包含一些属性。
``` ts
interface Counter {
  (): void; // 定义Counter这个结构必须包含一个函数，函数的要求是无参数，返回值为void，即无返回值
  count: number; // 而且这个结构还必须包含一个名为count、值的类型为number类型的属性
}

// getCounter返回值为 Counter类型
const getCounter = (): Counter => {
  // 这里定义一个函数用来返回这个计数器类型
  const c = () => {
    c.count++;
  };
  c.count = 0; // 再给这个函数添加一个count属性初始值为0
  return c; // 最后返回这个函数对象
};

// 这里的counter是上面的Counter的一个具体实例
const counter: Counter = getCounter(); // 通过getCounter函数得到这个计数器

counter();
console.log(counter.count); // 1

counter();
console.log(counter.count); // 2
```

## 📄 可选/只读属性

#### 📄 可选属性
定义 `interface` 的时候，在属性名后面加个 `?`。
``` ts
interface MyType {
  color?: string; // 这里的color属性即是一个可有可无的属性
  type: string;
}

const tmp: MyType = { type: 'string' } // 正确
```

#### 📄 只读属性
定义 `interface` 的时候，使用 `readonly`。
``` ts
interface Role {
  readonly 0: string;
  readonly 1: string;
}

const role: Role = {
  0: "super_admin",
  1: "admin",
};
role[1] = "super_admin"; // 无法为“1”赋值，因为它是只读属性。
```


## 📄 多余属性检查
- 接口的校验是严格的，在定义一个实现某个接口的值的时候，对于接口中没有定义的字段是不允许出现的，我们称这个为多余属性检查。

> 实际使用的时候，有的时候并不希望 TypeScript 这么严格地对我们的数据进行检查。 比如传递给接口多余的参数, 或者 处理过程中多余的参数传递。这样 就需要绕开多余属性检查：

#### 📄 使用类型断言
``` ts
interface MyType {
  color?: string;
  type: string;
}

const getTypes = ({ color, type }: MyType) => {
  return `A ${color ? color + " " : ""}${type}`;
};

getTypes({
  type: "tomato",
  size: 12,
  price: 1.2
} as MyTypes) // 这里就是类型断言
```

#### 📄 添加索引签名
``` ts
interface MyType {
  color: string;
  type: string;
  [prop: string]: any;
}

const getTypes = ({ color, type }: MyType) => {
  return `A ${color ? color + " " : ""}${type}`;
};

getTypes({
  color: "red",
  type: "tomato",
  size: 12,
  price: 1.2
});
```

#### 📄 利用类型兼容性(不推荐)
> 将对象字面量赋给一个变量option，然后getTypes传入 option，是因为直接将对象字面量传入函数，和先赋给变量再将变量传入函数，这两种检查机制是不一样的，后者是因为类型兼容性。
``` ts
interface MyType {
  type: string;
}
const getTypes = ({ type }: MyType) => {
  return `A ${type}`;
};

const option = { type: "tomato", size: 12 };
getTypes(option);
```
