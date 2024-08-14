# Stream流

## limit，skip的作用
limit+skip 类似于 substring 的作用，截取给定的参数的最大数量，skip 指跳过 n 个元素

``` java
List.of("A", "B", "C", "D", "E", "F")
    .stream()
    .skip(2) // 跳过A, B
    .limit(3) // 截取C, D, E
    .collect(Collectors.toList()); // [C, D, E]
```
