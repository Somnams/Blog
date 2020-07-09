module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': 'off', // 允许 console
    'no-cond-assign': 'off', // 允许在条件表达式中出现赋值操作
    'no-debugger': 'off', // 允许使用 debugger
    'no-inner-declarations': 'off', // 允许在嵌套的块中出现变量声明或 function 声明
    'no-misleading-character-class': 'off', // 允许在字符类语法中出现由多个代码点组成的字符
    'no-obj-calls': 'off', // 允许把全局对象作为函数调用
    'no-prototype-builtins': 'off', // 允许直接调用 Object.prototypes 的内置属性
    'no-template-curly-in-string': 'off', // 允许在常规字符串中出现模板字面量占位符语法
    'no-unreachable': 'off', // 允许在 return、throw、continue 和 break 语句之后出现不可达代码
    'no-unsafe-finally': 'off', // 允许在 finally 语句块中出现控制流语句
    'no-unsafe-negation': 'off', // 允许对关系运算符的左操作数使用否定操作符
    'no-case-declarations': 'off', // 允许在 case 子句中使用词法声明
    'no-else-return': 'off', // 允许 if 语句中 return 语句之后有 else 块
    'no-self-assign': 'off', // 允许自我赋值
    'no-unused-vars': 'off', // 忽略声明但并未使用的变量

    'default-case': 'warn', // 【建议】要求 switch 语句中有 default 分支
    'no-caller': 'error', // 禁用 arguments.caller 或 arguments.callee
    'no-div-regex': 'error', // 禁止除法操作符显式的出现在正则表达式开始的位置
    'no-empty-function': 'error', // 禁止出现空函数
    'no-empty-pattern': 'error', // 禁止出现空解构模式
    'no-extra-label': 'error', // 禁用不必要的标签
    'no-fallthrough': 'error', // 禁止 case 语句落空
    'no-invalid-this': 'error', // 禁止 this 关键字出现在类和类对象之外
    'no-iterator': 'error', // 禁用 __iterator__ 属性
    'no-loop-func': 'error', // 循环中不允许出现函数声明
    'no-new-wrappers': 'error', // 禁止对 String，Number 和 Boolean 使用 new 操作符
    'no-octal': 'error', // 禁用八进制字面量
    'no-redeclare': 'error', // 禁止多次声明同一变量
    'no-self-compare': 'error', // 禁止自身比较
    'no-var': 'error', // 禁用 var
    'no-sparse-arrays': 'error', // 禁止使用稀疏数组
    'no-delete-var': 'error', // 禁用 delete 关键字
    'no-undef-init': 'error', // 禁止将变量初始化为 undefined
    'no-undefined': 'error', // 禁止将 undefined 作为标识符
    'new-cap': 'error', // 强制构造函数首字母大写
    'no-mixed-spaces-and-tabs': 'error', // 禁止空格和 tab 混合缩进
    'no-multi-assign': 'error', // 禁止连续赋值
    'prefer-const': 'error', // 如果一个变量声明后未被修改，强制使用 const
    'prefer-rest-params': 'error', // 禁用 arguments

    indent: ['error', 2], // 强制缩进两个空格
    quotes: ['error', 'single'], // 强制只允许单引号字符串
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
