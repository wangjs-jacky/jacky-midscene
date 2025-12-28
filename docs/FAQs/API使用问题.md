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


