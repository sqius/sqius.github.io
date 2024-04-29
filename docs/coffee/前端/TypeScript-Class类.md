# TypeScript-Class 类

## 📄 定义
``` ts
class Person {
  name = "ZS";
  getName() {
    return this.name;
  }
}

const person = new Person();
person.getName(); // "ZS"
```

## 📄 继承
> 继承类，继承类属于子类，被继承的属于父类
``` ts
class LSPerson extends Person {
  constructor() {
    super();
    // super 关键字指向了父类，可以直接调用父类。不会受到类重写的影响
    console.log(super.getName());
    console.log(this.getName());
  }
  // 子类可以重写父类的属性与方法
  getName() {
    return "LS";
  }
}

const lsperson = new LSPerson();
console.log(lsperson.getName()); // "LS"
```

## 📄 构建函数
- `constructor` 构建函数，会在 `new` 实例的时候自动执行
``` ts
class Person {
  public name: string
  constructor(name: string) {
    this.name = name
  }
}
// 简化写法 constructor 里, 参数前加上public代表在之前已经声明过这个变量了
class Person {
  constructor(public name: string) {}
}
```

- 子继承父类并使用 `constructor` ，就必须使用 `super()` 调用父类的 `constructor`, 并按照父类的参数规则使用
``` ts
class Person {
  constructor(public name: string) {}
}

class Teacher extends Person {
  constructor(public age: number) {
    super('ZS')
  }
}
```

## 📄 修饰符
- public
> `public 公共的` - 类定义的外部可以访问的属性和方法（默认）
``` ts
class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getPosition() {
    return `(${this.x}, ${this.y})`;
  }
}
```

- private
> `private 私有的` - 在类内部使用 类的定义外无法访问
``` ts
class Parent {
  private age: number;
  constructor(age: number) {
    this.age = age;
  }
  private getAge() {
    return this.age;
  }
}

const p = new Parent(18);

console.log(p); // { age: 18 }
console.log(p.age); // error 属性“age”为私有属性，只能在类“Parent”中访问
console.log(Parent.age); // error 类型“typeof Parent”上不存在属性“age”

class Child extends Parent {
  constructor(age: number) {
    super(age);
    console.log(super.getAge()); // error 属性“getAge”为私有属性，只能在类“Parent”中访问。
  }
}
new Child(18);
```

- protected
> `protected 受保护的` - 允许在类内及继承的子类中使用
``` ts
class Parent {
  private age: number;
  constructor(age: number) {
    this.age = age;
  }
  protected getAge() {
    return this.age;
  }
}

class Child extends Parent {
  constructor(age: number) {
    super(age);
    console.log(super.getAge()); // allowed
  }
}
new Child(18);
```

::: tip
- protected还能用来修饰 constructor 构造函数
- constructor加了protected修饰符之后，这个类就不能再用来创建实例，只能被子类继承
``` ts
class Parent {
  protected constructor() {
  }
}
const p = new Parent(); // error 类“Parent”的构造函数是受保护的，仅可在类声明中访问

class Child extends Parent {
  constructor() {
    super();
  }
}
```

:::

- readonly
> `readonly 只读` - 设置为只读的属性，实例只能读取这个属性值，但不能修改
``` ts
class UserInfo {
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const user = new UserInfo("ZS");
user.name = "haha"; // error 无法为“name”赋值，因为它是只读属性。
```

## 📄 参数属性
- 静态属性
> 用 `static` 关键字来指定属性或方法是静态的，实例将不会添加这个静态属性，也不会继承这个静态方法，可以使用修饰符和 `static` 来指定一个属性或方法
``` ts
class Parent {
  private static age: number = 18;
  constructor() {}
}

const p = new Parent();
console.log(p.age); // error 属性“age”在类型“Parent”上不存在。
console.log(Parent.age); // error 属性“age”为私有属性，只能在类“Parent”中访问。
```

-  可选类属性
> 可选类属性，也是使用 `?` 符号来标记
``` ts
class Info {
  name: string;
  age?: number;
  constructor(name: string, age?: number, public sex?: string) {
    this.name = name;
    this.age = age;
  }
}

const info1 = new Info("ZS");
const info2 = new Info("ZS", 18);
const info3 = new Info("ZS", 18, "man");
```

## 📄 存储器
与 `ES6` 标准中的存值函数和取值函数一致
``` ts
class UserInfo {
  private _fullName?: string;
  constructor() {}
  get fullName() {
    return this._fullName;
  }
  set fullName(value) {
    console.log(`setter: ${value}`);
    this._fullName = value;
  }
}
const user = new UserInfo();
user.fullName = "LS"; // "setter: LS"
console.log(user.fullName); // "LS"
```

## 📄 抽象类
- 抽象类和类内部定义抽象方法，使用 `abstract` 关键字
- 只能被继承，不能实例化
- 抽象类里的抽象方法，在子类中是不继承，所以在子类中必须实现该方法的定义
- 抽象方法和抽象存取器都不能包含实际的代码块
``` ts
abstract class People {
  constructor(public name: string) {}
  abstract printName(): void;
  abstract _name: string;
  abstract get insideName(): string;
  abstract set insideName(value: string);
}

// error 非抽象类“Man”不会实现继承自“People”类的抽象成员"printName"
class Man extends People {
  _name: string;
  insideName: string;
  constructor(_name: string, insideName: string) {
    super(_name);
    this._name = _name;
    this.insideName = insideName;
  }
}
```

## 📄 实例类型
- 当我们定义一个类，并创建实例后，这个实例的类型就是创建他的类
- 如果你想实现对创建实例的类进行判断，需要用到instanceof关键字
``` ts
class People {
  constructor(public name: string) {}
}
// 指定类型不是必须的 TS会自动推断
let p: People = new People("ZS");

class Animal {
  constructor(public name: string) {}
}

p = new Animal("DOG"); // 同样实现的类 是被允许的
```

## 📄 类类型接口
- 使用接口可以强制一个类的定义必须包含某些内容
- 指定一个类要继承的接口，使用关键字 `implements`
- 接口和接口、类和类的继承，使用 `extends`
``` ts
interface FoodInterface {
  type: string;
}

// error  类型 "FoodClass" 中缺少属性 "type"，但类型 "FoodInterface" 中需要该属性。
class FoodClass implements FoodInterface {
  constructor() {}
}
```

::: tip
- 接口检测的是使用该接口定义的类创建的实例: (属性不会添加到实例上)
``` ts
// no
class FoodClass implements FoodInterface {
  type: string; // 属性“type”没有初始化表达式，且未在构造函数中明确赋值。
  constructor() {}
}

// yes
class FoodClass implements FoodInterface {
  constructor(public type: string) {}
}
```
:::

## 📄 接口继承类
- 接口继承类类之后 只继承成员以及成员类型 不包括实现
- 接口也会继承 `private` 和 `protected` 修饰的成员，但这接口 只能被这个类或者这个类的子类实现
- 接口继承类 使用 `extends`
``` ts
class A {
  protected name: string;
}

// 接口继承类
interface I extends A {}

// 类类型接口
class B implements I {} // 类型 "B" 中缺少属性 "name"，但类型 "A" 中需要该属性
class C implements I { // error 属性“name”受保护，但类型“C”并不是从“A”派生的类
  name: string;
}

// private 和 protected 修饰的成员，这个接口只能被这个类或者这个类的子类实现
class D extends A implements I { // allowed
  getName() {
    return this.name;
  }
}
```
