# 常见问题 - API 使用

## Q1: `callAIWithObjectResponse` 与直接使用 OpenAI SDK 的区别是什么？

**问题描述**：在 `connectivity-test` 中看到两种调用方式，不清楚 `callAIWithObjectResponse` 相比直接使用 OpenAI SDK 有什么优势。

**答案**：

`callAIWithObjectResponse` 相比直接使用 OpenAI SDK 的主要优势包括：

### 1. **类型安全与泛型支持**

`callAIWithObjectResponse` 支持泛型 `<T>`，可以提前定义响应类型，提供完整的 TypeScript 类型检查：

```typescript
// 使用 callAIWithObjectResponse - 类型安全
const result = await callAIWithObjectResponse<{ yyy: string }>(
  [
    {
      role: "user",
      content: "告诉我这张图片里有什么？请以 JSON 格式返回 {yyy: string}",
    },
    // ... 图片内容
  ],
  AIActionType.EXTRACT_DATA,
  globalModelConfigManager.getModelConfig('default')
);
// result.content.yyy 有完整的类型提示和检查
console.log(result.content.yyy);

// 直接使用 OpenAI SDK - 需要手动解析，无类型安全
const response = await openai.chat.completions.create({...});
const content = response.choices[0].message.content; // string 类型
const parsed = JSON.parse(content); // 需要手动解析，无类型检查
```

### 2. **提示词与类型定义的对应关系**

提示词中的 JSON 格式要求必须与泛型定义对应：

```typescript
// ✅ 正确：提示词中的格式与泛型定义一致
await callAIWithObjectResponse<{ yyy: string }>(
  [
    {
      role: "user",
      content: "请以 JSON 格式返回 {yyy: string}", // 格式匹配
    },
  ],
  ...
);
// result.content.yyy 可以直接访问

// ❌ 错误：提示词格式与泛型定义不一致
await callAIWithObjectResponse<{ yyy: string }>(
  [
    {
      role: "user",
      content: "请以 JSON 格式返回 {content: string}", // 格式不匹配
    },
  ],
  ...
);
// result.content.yyy 会是 undefined
```

### 3. **自动 JSON 解析和容错处理**

`callAIWithObjectResponse` 会自动处理以下情况：
- ✅ 从 markdown 代码块中提取 JSON（````json ... ````）
- ✅ 修复格式不完整的 JSON（使用 `jsonrepair`）
- ✅ 规范化 JSON（去除键和值的空白字符）
- ✅ 支持不同视觉模型的特殊格式处理

### 4. **统一的配置管理**

使用 `globalModelConfigManager` 统一管理模型配置，支持：
- 不同模型的配置切换
- 统一的错误处理
- 使用情况统计（usage）

### 5. **返回值结构**

`callAIWithObjectResponse` 返回：
```typescript
{
  content: T,              // 解析后的类型化对象
  contentString: string,   // 原始 JSON 字符串
  usage?: AIUsageInfo      // API 使用情况
}
```

**相关资源**：
- 代码位置：`midscene/packages/core/src/ai-model/service-caller/index.ts`
- 测试示例：`midscene-example/connectivity-test/tests/connectivity.test.ts`
- 相关函数：`safeParseJson`, `extractJSONFromCodeBlock`

**标签**：#API #类型安全 #JSON解析 #最佳实践

---

## Q2: 如何正确使用 `callAIWithObjectResponse` 的泛型？

**问题描述**：不清楚如何定义泛型类型，以及如何确保提示词与类型定义一致。

**答案**：

### 使用步骤：

1. **定义响应类型**：在泛型中指定期望的 JSON 结构
2. **编写提示词**：在提示词中明确要求返回对应的 JSON 格式
3. **访问结果**：直接访问类型化的属性

### 示例：

```typescript
// 示例 1：简单对象
const result1 = await callAIWithObjectResponse<{ content: string }>(
  [
    {
      role: "user",
      content: "这张图片的内容是什么？请以 JSON 格式返回 {content: string}",
    },
  ],
  AIActionType.EXTRACT_DATA,
  modelConfig
);
console.log(result1.content.content); // 类型安全

// 示例 2：复杂对象
const result2 = await callAIWithObjectResponse<{
  name: string;
  age: number;
  isAdmin: boolean;
}>(messages, AIActionType.EXTRACT_DATA, modelConfig);
console.log(result2.content.name);    // string
console.log(result2.content.age);     // number
console.log(result2.content.isAdmin); // boolean

// 示例 3：数组
const result3 = await callAIWithObjectResponse<{ items: string[] }>(
  [
    {
      role: "user",
      content: "提取所有待办事项，请以 JSON 格式返回 {items: string[]}",
    },
  ],
  AIActionType.EXTRACT_DATA,
  modelConfig
);
console.log(result3.content.items); // string[]
```

### 注意事项：

1. **提示词格式必须匹配**：提示词中的 `{key: type}` 必须与泛型定义一致
2. **类型要准确**：确保泛型类型与实际返回的 JSON 结构匹配
3. **处理可选字段**：如果字段可能不存在，使用 `key?: type` 或 `Partial<T>`

**相关资源**：
- 代码位置：`midscene/packages/core/src/ai-model/service-caller/index.ts:392`
- 测试示例：`midscene-example/connectivity-test/tests/connectivity.test.ts:79`

**标签**：#API #TypeScript #泛型 #最佳实践

---

## Q3: 为什么使用 `OPENAI_API_KEY` 配置 Qwen 模型还能跑通？

**问题描述**：在 `.env` 文件中使用 `OPENAI_API_KEY` 配置 Qwen 模型（如 `qwen3-vl-plus`），为什么还能正常工作？是因为标准相同吗？

**答案**：

是的，这是因为 **OpenAI 兼容 API 标准**（OpenAI-compatible API）。主要原因如下：

### 1. **OpenAI SDK 的灵活性**

Midscene 使用 OpenAI SDK 来调用 AI 服务，但 SDK 支持通过 `baseURL` 参数指向不同的服务提供商：

```typescript
// 代码位置：midscene/packages/core/src/ai-model/service-caller/index.ts:139-150
const openAIOptions = {
  baseURL: openaiBaseURL,  // 可以指向任何 OpenAI 兼容的 API 端点
  apiKey: openaiApiKey,     // 对应服务提供商的 API Key
  // ...
};

const baseOpenAI = new OpenAI(openAIOptions);
```

### 2. **OpenAI 兼容 API 标准**

许多模型提供商（如 Qwen、Gemini、豆包等）都提供了 **OpenAI 兼容的 API 接口**，这意味着：

- ✅ 使用相同的 API 格式（`/v1/chat/completions`）
- ✅ 使用相同的请求参数格式
- ✅ 使用相同的响应格式
- ✅ 只需要修改 `baseURL` 和 `modelName` 即可切换模型

### 3. **配置示例**

以 Qwen3-VL 为例：

```bash
# .env 文件
OPENAI_API_KEY="sk-..."                    # Qwen 的 API Key（虽然变量名是 OPENAI_API_KEY）
OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"  # Qwen 的 API 端点
MIDSCENE_MODEL_NAME="qwen3-vl-plus"       # Qwen 的模型名称
```

### 4. **为什么变量名是 `OPENAI_API_KEY`？**

这是为了**向后兼容**和**简化配置**：

- `OPENAI_API_KEY` 只是一个**环境变量名**，不代表只能用于 OpenAI
- 实际使用的是对应服务提供商的 API Key（如 Qwen 的 API Key）
- Midscene 会读取这个变量并传递给 OpenAI SDK，SDK 会根据 `baseURL` 发送到正确的服务端点

### 5. **工作原理**

```
用户配置：
├── OPENAI_API_KEY="qwen-api-key"          # Qwen 的 API Key
├── OPENAI_BASE_URL="https://dashscope..." # Qwen 的 API 端点
└── MIDSCENE_MODEL_NAME="qwen3-vl-plus"    # Qwen 的模型名

Midscene 处理：
├── 读取环境变量
├── 创建 OpenAI SDK 实例（baseURL 指向 Qwen）
└── 调用 Qwen 的 API（使用 OpenAI 兼容格式）

实际请求：
POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
Headers: Authorization: Bearer qwen-api-key
Body: { model: "qwen3-vl-plus", messages: [...] }
```

### 6. **支持的模型提供商**

根据 Midscene 文档，以下模型提供商都支持 OpenAI 兼容 API：

- ✅ **Qwen**（通义千问）：`https://dashscope.aliyuncs.com/compatible-mode/v1`
- ✅ **Gemini**：`https://generativelanguage.googleapis.com/v1beta/openai/`
- ✅ **豆包**（火山引擎）：`https://ark.cn-beijing.volces.com/api/v3`
- ✅ **OpenAI**：`https://api.openai.com/v1`（默认）

### 7. **推荐配置方式**

虽然可以使用 `OPENAI_API_KEY`，但 Midscene 推荐使用更明确的变量名：

```bash
# 推荐方式（更明确）
MIDSCENE_MODEL_API_KEY="sk-..."
MIDSCENE_MODEL_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
MIDSCENE_MODEL_FAMILY="qwen3-vl"

# 兼容方式（向后兼容）
OPENAI_API_KEY="sk-..."
OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
```

**相关资源**：
- 代码位置：`midscene/packages/core/src/ai-model/service-caller/index.ts:139-150`
- 文档：[模型配置](https://midscenejs.com/zh/model-config)
- 文档：[常用模型配置](https://midscenejs.com/zh/model-common-config)
- 测试示例：`midscene-example/connectivity-test/tests/connectivity.test.ts`

**标签**：#API #配置 #OpenAI兼容 #Qwen #模型配置

---

