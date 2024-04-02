# 来个标题

#### 1. 建表，删表

- 创建一张学生表STUDENT,包含学号(字符串)、姓名、性别、创建时间、修改时间，以学号为主键
``` sql
create table STUDENT (
    'id' varchar(50) not null primary key comment '学号',
    'name' varchar(50) not null comment '姓名',
    'sex' varchar(2) not null comment '性别',
    'CreateTime' timestamp not null default CURRENT_TIMESTAMP comment '创建时间',
    'updateTime' timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP comment '更新时间'
);
```

- 创建一张课程表COURSE,包含编号(字符串)，名称、描述，以编号为主键
``` sql
create table COURSE (
    'serialNumber' varchar(50) not null primary key comment '编号',
    'KCName' varchar(50) not null comment '课程名称',
    'info' varchar(255) not null comment '描述'
);
```

- 创建一张学生成绩表SCORE,包含成绩流水号(整型)、学号、课程编号、成绩(整型)，以流水号为主键
``` sql
create table SOURCE (
    'sourceID' integer(20) not null primary key comment '成绩流水号',
    'studentID' varchar(50) not null comment '学号',
    'serialNumber' varchar(50) not null comment '课程编号',
    'sources' integer(20) not null comment '成绩'
);
```

- 创建一张老师表TEACHER,包含职工号(字符串)、姓名，以职工号为主键
``` sql
create table TEACHER (
    'NoID' varchar(50) not null primary key comment '工号',
    'name' varchar(50) not null comment '姓名'
);
```

- 删除老师表
``` sql
drop table TEACHER;
```

#### 2. 添加与清除表中数据
- 添加学生表数据
``` sql
insert into STUDENT (id, name, sex) values ('1', '张三', '男');
insert into STUDENT (id, name, sex) values ('2', '李四', '女');
insert into  STUDENT (id, name, sex) values (('3','王五','男'),('4','赵六','女'),('5','钱七','男'));
```

- 添加课程表数据
``` sql
insert into COURSE (serialNumber, KCName, info) values ('1', '语文', '必修');
insert into COURSE (serialNumber, KCName, info) values ('2', '数学', '必修');
insert into COURSE (serialNumber, KCName, info) values ('3', '英语', '必修');
```

- 添加成绩表数据
``` sql
insert into SOURCE(sourceID, studentID, serialNumber, sources) values ('1', '1', '1', '90');
insert into SOURCE(sourceID, studentID, serialNumber, sources) values ('2', '1', '2', '90');
```

- 删除成绩表数据
``` sql
delete from SOURCE where studentID = '1';
```

#### 3. 添加字段、更改字段
- 往学生表里追加生日字段
``` sql
alter table STUDENT add birthdate date comment '出生日期';
```
- 改成绩表中的成绩字段为number(18,2)类型
``` sql
alter table SOURCE modify COLUMN sources decimal(18,2);
```

#### 4.备份原表
- 备份成绩表
``` sql
create table BACKUP_SOURCE as select * from SOURCE;
```

#### 5. 集合累加
- 查出成绩表与成绩备份表中的记录，并标记记录来源(成绩表、成绩备份表)
``` sql
select 'SOURCE' as 来源 ,* from SOURCE
union all
select 'BACKUP_SOURCE' as 来源 ,* from BACKUP_SOURCE;
```

#### 6. 集合关联
- 查出成绩表与成绩备份表不重复记录
``` sql
select *
from SOURCE t1 where not exists(
select 1 from BACKUP_SOURCE t2
         where t2.studentID = t1.studentID and t2.serialNumber = t1.serialNumber )
union
select *
from BACKUP_SOURCE t2 where not exists(
    select 1 from SOURCE t1
    where t1.studentID = t2.studentID and t1.serialNumber = t2.serialNumber );
```

- 查询成绩表与成绩备份表中所有记录（去掉重复行）
``` sql
select *
from SOURCE
union
select * from BACKUP_SOURCE;
```

#### 7. 分组、汇总、筛选
- 取有大于2个学生成绩高于80分课程
``` sql
select sourceID, serialNumber,count(distinct studentID) as 人数
from SOURCE where sources > 80
            group by studentID
having count(distinct studentID) > 2;
```

#### 8. 子查询
- 查学生的各课成绩与课程的平均成绩分差
``` sql
# select studentID, serialNumber, sources, avg(sources) over(partition by serialNumber) as 平均分
select s.studentID,s.sources,s.serialNumber, s.sources - c.sources as 分差  from SOURCE s
left join (
select avg(SOURCE.sources) as sources ,max(serialNumber) as serialNumber from SOURCE group by serialNumber
) c on c.serialNumber = s.serialNumber;
```

#### 9. 分页取数
- 成绩表中按成绩从高到低排序，页大小为2，取第2页数据
``` sql
select *
from SOURCE order by sources desc
            limit 2 offset 2;
```

#### 10. 关联更新
- 更改成绩表中部分数据，并把相应记录通过一条语句更新到成绩备份表中
``` sql
pdate SOURCE s
    join BACKUP_SOURCE BS
    on s.studentID = BS.studentID and s.serialNumber = BS.serialNumber
set s.sources = 100 where s.sources = 99;

update SOURCE set sources = 99 where studentID = '1' and serialNumber = '1';
insert into BACKUP_SOURCE (studentID, serialNumber, sources)
select studentID, serialNumber, sources from SOURCE where studentID = '1' and serialNumber = '1'
                                                    on duplicate key update sources = 99;

# 触发器更新
DELIMITER //

CREATE TRIGGER update_source AFTER UPDATE ON SOURCE
    FOR EACH ROW
BEGIN
    UPDATE BACKUP_SOURCE
    SET sources = NEW.sources
    WHERE studentID = NEW.studentID AND serialNumber = NEW.serialNumber;
END //

DELIMITER ;
```

#### 11. 数据同步
- 同步成绩中的数据到备份表，成绩表中不存在的则在备份表中删除，成绩表中存在且备份表中也存在则更新，成绩表中存在备份表中不存在则进行插入
``` sql
delete b from BACKUP_SOURCE b
    left join SOURCE s on s.sourceID = b.sourceID where s.sourceID is null;
REPLACE INTO BACKUP_SOURCE (sourceID, studentID, serialNumber, sources)
SELECT sourceID, studentID, serialNumber, sources
FROM SOURCE;
```
#### 12. 创建索引与约束
``` sql
# 创建索引
create index idx_studentID on SOURCE(studentID);
create index idx_studentID_serialNumber on SOURCE(studentID, serialNumber);
# 创建唯一索引
create unique index idx_studentID_serialNumber on SOURCE(studentID, serialNumber);
# 删除索引
drop index idx_studentID on SOURCE;

# 创建主键约束
alter table STUDENT add constraint pk_studentID primary key (id);
# 创建唯一约束
alter table SOURCE add constraint uk_studentID unique (studentID);
# 创建外键约束
alter table SOURCE add constraint fk_studentID foreign key (studentID) references STUDENT(id);
```


#### 13. 分析函数
``` sql
# 创建分析函数
SELECT
    sourceID,
    ROW_NUMBER() OVER (ORDER BY studentID) AS row_num,
    AVG(sources) OVER () AS overall_avg,
    AVG(sources) OVER (PARTITION BY studentID) AS category_avg
FROM
    SOURCE;
# ROW_NUMBER()：
# 为结果集中的每一行分配一个唯一的、连续的行号。
# RANK() 和 DENSE_RANK()：
# RANK() 函数根据指定列的值排序，并给每组的第一个行赋予排名1，后续相同的值会被赋予相同的排名，但下一个不同的值排名会跳过被重复占据的排名。
# DENSE_RANK() 类似于 RANK()，但它不会跳过任何排名，即使有相同值也会按照顺序排列。
# LEAD() 和 LAG()：
# LEAD(column, [offset], [default]) 函数用于获取当前行之后的某一行（默认下一行）的列值。
# LAG(column, [offset], [default]) 函数用于获取当前行之前的某一行（默认上一行）的列值。
# FIRST_VALUE() 和 LAST_VALUE()：
# 这两个函数分别返回窗口内第一行和最后一行的指定列值。
# NTILE()：
# 将行分布到指定数量的桶中，每个桶包含大致相等数量的行。
# CUME_DIST() 和 PERCENT_RANK()：
# CUME_DIST() 计算累积分布，即当前行的排名除以总行数的比例。
# PERCENT_RANK() 计算百分比排名，类似于CUME_DIST，但是范围在0-1之间，并且最小值为0。
# AVG() OVER()、SUM() OVER()、COUNT() OVER() 等聚合函数配合窗口函数使用：
# 可以在分组或排序后的窗口范围内进行平均、求和或计数等统计操作。
# PARTITION BY 子句：
# 在分析函数中用于定义窗口的分区，可以在不同分区里独立地应用分析函数。
```
