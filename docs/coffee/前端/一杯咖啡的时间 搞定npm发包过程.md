# 一杯咖啡的时间 搞定npm发包过程

## 🎒 准备工作
确保你的项目满足以下条件:
- 已经安装了 `Node.js` 和 `NPM`。如果还没有安装，请访问 [Node.js](https://nodejs.org/en) 官网 下载并安装。
- 项目有一个 `package.json` 文件。如果没有，你可以通过运行 `npm init` 来创建一个。
``` bash
npm init
```

## 🎒 更新 package.json 文件
确保你的 `package.json` 文件包含以下信息:
- `name` : 包名，确保是全局唯一的(小写的英文 + 短横线)， eg: `@vue/use`,` @vue/core`。
- `version` : 当前包版本，遵循 [Semantic Versioning](https://semver.org/) 规范。
- `main` : 包的入口文件。
- `scripts` : 包中可执行的脚本。
- `dependencies` 和 `devDependencies` : 包所依赖的其他包。 如:
``` json title="package.json"
{
  "name": "your-package-name", "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

## 🎒 创建 .npmignore 文件
创建一个 `.npmignore` 文件来排除发布时不需要的文件。这类似于 `.gitignore` 文件。如:
``` ignore title=".npmignore"
node_modules
*.log
*.swp
*.bak
```

## 🎒 登录 NPM 账户
在终端中运行 `npm login` 命令，并输入你的 `NPM` 账户名、密码和邮箱。如果还没有账户，可以通过 运行 `npm adduser` 创建一个。
``` bash
npm login
```

## 🎒 发布包

``` bash
npm publish
+ your-package-name@1.0.0
```
登录 [NPM](https://www.npmjs.com/) 官网，进入你的个人主页，查看已发布的包。

## 🎒 更新和维护
当你的包需要更新时，确保按照 [Semantic Versioning](https://semver.org/) 规范更新 重新执行 命令发布新版本。
现在可以通过 `npm install your-package-name`命令安装你的包。