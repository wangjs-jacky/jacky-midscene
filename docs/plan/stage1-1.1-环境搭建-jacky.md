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
1. [x] 在 `midscene-example/connectivity-test/` 目录下创建 `.env` 文件
2. [x] 配置你的 LLM API Key（OpenAI 或其他支持的模型）
3. [x] 运行 `npm install` 安装依赖
4. [x] 运行 `npm run test` 执行连接测试
5. [x] 确保测试通过，能够成功调用 LLM API

### 验证作业
1. [ ] 尝试使用不同的模型（如 OpenAI GPT-4o、Qwen 等）
2. [ ] 记录不同模型的响应时间和成本差异
3. [ ] 创建一个简单的测试脚本，验证 API 配置是否正确

## 完成状态
- [ ] 未开始
- [ ] 进行中
- [x] 已完成

## 完成时间
2025-1228

## 遇到的问题
在这个 case 中要求使用的 OPENAI_API_KEY 的 key 的申请，根本没有必要去买 OpenAI 的 Key，在《OpenAI 兼容 API》中模型的发展历史有了一个介绍，目前主流的 LLM 提供商都存在对应的兼容接口。因此在这里我直接用的是 Qwen 模型，因为阿里的模型应该是所有国内提供厂商中支持最全的，各类大模型都提供，而且购买都很方便。

## 解决方案
了解 OpenAI 兼容 API 标准，并使用 Qwen 模型作为 KEY

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

