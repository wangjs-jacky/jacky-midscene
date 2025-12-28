# 作业：Playwright 自动化基础

## 作业描述
学习 Playwright 集成，理解 Agent 的基本概念，掌握核心 API 的使用方法。

## 学习目标
- 学习 Playwright 集成（`playwright-demo/demo.ts`）
- 理解 Agent 的基本概念
- 掌握核心 API：`aiAction()`、`aiQuery()`、`aiWaitFor()`、`aiAssert()`、`aiTap()`、`aiBoolean()`、`aiNumber()`、`aiString()`、`aiLocate()`

## 完成步骤

### 基础作业
1. [ ] 运行 `playwright-demo/demo.ts` 示例，观察执行过程
2. [ ] 理解每一行代码的作用，在代码中添加注释说明
3. [ ] 修改示例，将 `headless: true` 改为 `headless: false`，观察浏览器操作过程

### 实战作业 1 - 商品搜索与提取
1. [ ] 在 eBay 上搜索"laptop"（或任意商品）
2. [ ] 提取前 5 个商品的信息，包括：商品名称、价格、评分、链接
3. [ ] 将提取的数据保存为 JSON 文件
4. [ ] 使用 `aiAssert()` 验证至少找到了 5 个商品

### 实战作业 2 - 登录流程自动化
1. [ ] 选择一个有登录功能的网站（如 GitHub、Reddit 等）
2. [ ] 使用 `aiAction()` 完成登录流程
3. [ ] 使用 `aiWaitFor()` 等待登录成功
4. [ ] 使用 `aiAssert()` 验证登录状态
5. [ ] 注意：不要硬编码密码，使用环境变量

### 实战作业 3 - 数据提取
1. [ ] 访问一个新闻网站（如 BBC、CNN）
2. [ ] 提取首页所有新闻标题和链接
3. [ ] 使用 `aiQuery()` 提取结构化数据
4. [ ] 将数据保存为 CSV 文件

## 完成状态
- [x] 未开始
- [ ] 进行中
- [ ] 已完成

## 完成时间
待完成

## 遇到的问题
（完成过程中记录遇到的问题）

## 解决方案
（记录问题的解决方案）

## 学习总结
（完成作业后的总结和收获）

## 相关资源
- 代码位置：`midscene-example/playwright-demo/demo.ts`
- [Midscene 文档](https://midscenejs.com/zh)

## 思考问题
1. `aiAction()` 和 `aiTap()` 有什么区别？什么时候用哪个？
2. `aiQuery()` 返回的数据结构是如何确定的？如何确保提取的数据格式正确？
3. `aiWaitFor()` 和普通的 `sleep()` 有什么区别？为什么推荐使用 `aiWaitFor()`？
4. 如果 `aiAction()` 执行失败，可能的原因有哪些？如何调试？
5. `aiBoolean()`、`aiNumber()`、`aiString()` 这三个方法的使用场景分别是什么？
6. Agent 是如何理解自然语言指令的？它能看到页面的哪些信息？

## 扩展问题（附加题）
1. **挑战任务 1**：创建一个自动化脚本，在电商网站上完成完整的购物流程
2. **挑战任务 2**：实现一个数据监控脚本
3. **挑战任务 3**：创建一个表单自动填写工具
4. **研究任务**：对比 Midscene 和传统 Playwright 脚本

