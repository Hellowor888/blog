const n=`---
title: Markdown 写作指南
date: 2026-05-23
tags: [教程, 写作]
excerpt: 一篇简单的 Markdown 语法指南，帮助你快速上手博客写作。
---

# Markdown 写作指南

这篇文章展示了一些常用的 Markdown 语法。

## 文本格式

- **粗体** — \`**粗体**\`
- *斜体* — \`*斜体*\`
- ~~删除线~~ — \`~~删除线~~\`
- \`行内代码\` — \`\` \`行内代码\` \`\`

## 标题层级

# 一级标题
## 二级标题
### 三级标题
#### 四级标题

## 列表

### 无序列表
- 项目一
- 项目二
- 项目三

### 有序列表
1. 第一步
2. 第二步
3. 第三步

## 代码块

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

\`\`\`typescript
const greeting: string = "Hello, TypeScript!"
console.log(greeting)
\`\`\`

## 引用

> 这是一段引用文字。
> 可以跨多行。

## 链接和图片

- [GitHub](https://github.com)
- 图片：\`![替代文字](图片地址)\`

## 表格

| 功能 | 状态 |
|------|------|
| 文章列表 | 完成 |
| 标签筛选 | 完成 |
| 深色模式 | 完成 |
| Markdown 渲染 | 完成 |

---

以上就是常用的 Markdown 语法，足够写出漂亮的博客文章了！
`;export{n as default};
