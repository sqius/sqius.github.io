## Stream流

#### limit，skip的作用
limit+skip类似于substring的作用，截取给定的参数的最大数量，skip指跳过n个元素
List.of("A", "B", "C", "D", "E", "F")
    .stream()
    .skip(2) // 跳过A, B
    .limit(3) // 截取C, D, E
    .collect(Collectors.toList()); // [C, D, E]
