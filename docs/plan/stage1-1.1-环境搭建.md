# 作业：环境搭建与配置

## 作业描述
完成 Midscene 的环境搭建，配置 LLM API，并运行连接测试。这是学习 Midscene 的第一步，需要确保环境配置正确。

## 学习目标
- 安装 Midscene 依赖包
- 配置 LLM API（环境变量设置）
- 运行连接测试（`connectivity-test/`）
- 理解 Midscene 支持的模型类型

## 完成步骤

### 基础作业
1. [ ] 在 `midscene-example/connectivity-test/` 目录下创建 `.env` 文件
2. [ ] 配置你的 LLM API Key（OpenAI 或其他支持的模型）
3. [ ] 运行 `npm install` 安装依赖
4. [ ] 运行 `npm run test` 执行连接测试
5. [ ] 确保测试通过，能够成功调用 LLM API

### 验证作业
1. [ ] 尝试使用不同的模型（如 OpenAI GPT-4o、Qwen 等）
2. [ ] 记录不同模型的响应时间和成本差异
3. [ ] 创建一个简单的测试脚本，验证 API 配置是否正确

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
- [Midscene 文档 - 模型配置](https://midscenejs.com/model-provider.html)
- [Midscene 文档 - 选择模型](https://midscenejs.com/choose-a-model)
- 代码位置：`midscene-example/connectivity-test/README.md`

## 思考问题
1. 为什么需要配置环境变量而不是直接在代码中写 API Key？
2. Midscene 支持哪些 LLM 模型？它们之间有什么区别？
3. 如果连接测试失败，可能的原因有哪些？如何排查？
4. `.env` 文件的作用是什么？为什么不应该提交到 Git？

## 扩展问题（附加题）
1. 研究 Midscene 的模型配置文档，尝试配置一个本地模型（如 Ollama）
2. 编写一个脚本，自动检测和验证所有配置的环境变量
3. 创建一个配置管理工具，支持在不同环境（开发/生产）之间切换配置

