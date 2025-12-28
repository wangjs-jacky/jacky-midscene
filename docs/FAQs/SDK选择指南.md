# SDK 选择指南：OpenAI SDK vs 其他统一 SDK

## 问题：对于兼容 API，应该使用哪个 SDK？

当使用 OpenAI 兼容 API 时，你有几个选择：
1. **直接使用 OpenAI SDK**（通过 `baseURL` 切换）
2. **使用统一 SDK**（如 Vercel AI SDK、LiteLLM）
3. **使用各厂商的专用 SDK**（如果提供）

## 方案对比

### 方案一：直接使用 OpenAI SDK

**优点**：
- ✅ **简单直接**：只需要修改 `baseURL` 和 `apiKey`
- ✅ **官方支持**：OpenAI 官方维护，稳定可靠
- ✅ **类型完善**：TypeScript 类型定义完整
- ✅ **广泛使用**：社区支持好，文档丰富
- ✅ **Midscene 使用**：Midscene 就是基于 OpenAI SDK

**缺点**：
- ❌ **需要手动处理差异**：不同提供商的差异需要自己处理
- ❌ **功能限制**：某些提供商的特有功能可能无法使用
- ❌ **错误处理**：不同提供商的错误格式可能不同

**示例代码**：

```typescript
import OpenAI from 'openai';

// 使用 Qwen
const qwenClient = new OpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

// 使用 OpenAI
const openaiClient = new OpenAI({
  baseURL: 'https://api.openai.com/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

// 使用 Gemini
const geminiClient = new OpenAI({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  apiKey: process.env.GEMINI_API_KEY,
});

// 调用方式完全相同
const response = await qwenClient.chat.completions.create({
  model: 'qwen3-vl-plus',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

### 方案二：Vercel AI SDK（`ai` 包）

**简介**：
Vercel AI SDK 是一个统一的 AI SDK，支持多种模型提供商，提供统一的接口和 React/Next.js 集成。

**优点**：
- ✅ **统一接口**：一套 API 支持多个提供商
- ✅ **前端集成**：原生支持 React、Next.js、Svelte、Vue
- ✅ **流式响应**：内置流式响应支持
- ✅ **工具支持**：内置工具调用（tools）支持
- ✅ **活跃维护**：Vercel 团队维护，更新频繁

**缺点**：
- ❌ **主要面向前端**：更适合前端应用
- ❌ **功能可能受限**：某些高级功能可能不如原生 SDK
- ❌ **依赖较多**：可能引入不必要的依赖

**安装**：

```bash
npm install ai
```

**示例代码**：

```typescript
import { openai } from 'ai/openai';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// 配置不同的提供商
const qwenProvider = createOpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 统一调用
const { text } = await generateText({
  model: qwenProvider('qwen3-vl-plus'),
  prompt: 'Hello!',
});

// React 集成示例
import { useChat } from 'ai/react';

function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });
  // ...
}
```

**支持的提供商**：
- OpenAI
- Anthropic (Claude)
- Google (Gemini)
- Mistral AI
- Cohere
- 以及任何 OpenAI 兼容的 API

**官方文档**：https://sdk.vercel.ai/docs

### 方案三：LiteLLM

**简介**：
LiteLLM 是一个统一的 LLM 调用库，支持 100+ 模型，自动处理不同提供商的差异。

**优点**：
- ✅ **支持最多模型**：100+ 模型提供商
- ✅ **自动适配**：自动处理不同提供商的差异
- ✅ **统一接口**：一套代码支持所有模型
- ✅ **代理功能**：可以作为代理服务器
- ✅ **成本追踪**：内置成本追踪功能

**缺点**：
- ❌ **Python 为主**：主要面向 Python，JavaScript 支持相对较弱
- ❌ **学习成本**：需要学习 LiteLLM 的 API
- ❌ **可能过度设计**：对于简单场景可能过于复杂

**安装**：

```bash
# Python
pip install litellm

# JavaScript (实验性)
npm install litellm
```

**示例代码**：

```python
from litellm import completion

# 统一调用不同模型
response = completion(
    model="qwen/qwen3-vl-plus",
    messages=[{"role": "user", "content": "Hello!"}],
    api_key="your-api-key",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

# 或者使用环境变量
import os
os.environ["QWEN_API_KEY"] = "your-api-key"

response = completion(
    model="qwen/qwen3-vl-plus",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

**支持的模型**：https://docs.litellm.ai/docs/providers

### 方案四：各厂商专用 SDK

**简介**：
某些厂商提供了自己的 SDK，可能包含特有功能。

**示例**：

1. **Google Gemini SDK**
   ```typescript
   import { GoogleGenerativeAI } from '@google/generative-ai';
   
   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
   const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
   ```

2. **Anthropic Claude SDK**
   ```typescript
   import Anthropic from '@anthropic-ai/sdk';
   
   const anthropic = new Anthropic({
     apiKey: process.env.ANTHROPIC_API_KEY,
   });
   ```

**优点**：
- ✅ **特有功能**：可以使用厂商的特有功能
- ✅ **官方支持**：官方维护，功能完整
- ✅ **性能优化**：可能针对特定模型优化

**缺点**：
- ❌ **切换成本高**：切换模型需要改代码
- ❌ **学习成本**：每个 SDK 都需要学习
- ❌ **代码重复**：不同 SDK 的代码可能重复

## 选择建议

### 场景一：后端服务（如 Midscene）

**推荐**：直接使用 OpenAI SDK

**原因**：
- Midscene 就是基于 OpenAI SDK 构建的
- 简单直接，只需要修改 `baseURL`
- 类型完善，适合 TypeScript 项目
- 社区支持好

**示例**（Midscene 的做法）：

```typescript
// midscene/packages/core/src/ai-model/service-caller/index.ts
const openAIOptions = {
  baseURL: openaiBaseURL,  // 可以是任何兼容的端点
  apiKey: openaiApiKey,
  // ...
};

const baseOpenAI = new OpenAI(openAIOptions);
```

### 场景二：前端应用（React/Next.js）

**推荐**：Vercel AI SDK

**原因**：
- 原生支持 React/Next.js
- 内置流式响应和 UI 组件
- 统一的接口，易于切换模型
- Vercel 团队维护，质量有保障

**示例**：

```typescript
// app/api/chat/route.ts
import { openai } from 'ai/openai';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const qwenProvider = createOpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = await streamText({
    model: qwenProvider('qwen3-vl-plus'),
    messages,
  });
  
  return result.toDataStreamResponse();
}
```

### 场景三：Python 后端服务

**推荐**：LiteLLM 或直接使用 OpenAI SDK

**原因**：
- LiteLLM 在 Python 生态中支持最好
- 如果需要支持很多模型，LiteLLM 更方便
- 如果需要简单场景，OpenAI SDK 足够

### 场景四：需要特定功能

**推荐**：使用厂商专用 SDK

**原因**：
- 某些功能可能只在专用 SDK 中提供
- 官方 SDK 可能有性能优化
- 文档和支持更完善

## 实际对比示例

### 使用 OpenAI SDK

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

const response = await client.chat.completions.create({
  model: 'qwen3-vl-plus',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);
```

### 使用 Vercel AI SDK

```typescript
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const qwenProvider = createOpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

const { text } = await generateText({
  model: qwenProvider('qwen3-vl-plus'),
  prompt: 'Hello!',
});

console.log(text);
```

### 使用 LiteLLM（Python）

```python
from litellm import completion

response = completion(
    model="qwen/qwen3-vl-plus",
    messages=[{"role": "user", "content": "Hello!"}],
    api_key=os.getenv("QWEN_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

print(response.choices[0].message.content)
```

## Midscene 的选择

Midscene 选择了 **直接使用 OpenAI SDK**，原因：

1. **简单直接**：只需要修改 `baseURL` 即可支持所有兼容 API
2. **类型安全**：完整的 TypeScript 类型支持
3. **稳定可靠**：OpenAI SDK 是官方维护的
4. **灵活性强**：可以轻松扩展和自定义

**代码位置**：
- `midscene/packages/core/src/ai-model/service-caller/index.ts`
- 使用 `createChatClient` 函数创建客户端

## 总结

| SDK | 适用场景 | 优点 | 缺点 |
|-----|---------|------|------|
| **OpenAI SDK** | 后端服务、通用场景 | 简单、稳定、类型完善 | 需要手动处理差异 |
| **Vercel AI SDK** | 前端应用、React/Next.js | 前端集成好、统一接口 | 主要面向前端 |
| **LiteLLM** | Python 后端、多模型支持 | 支持最多模型、自动适配 | Python 为主 |
| **厂商专用 SDK** | 需要特定功能 | 功能完整、官方支持 | 切换成本高 |

**推荐**：
- **后端 TypeScript 项目**：使用 OpenAI SDK（如 Midscene）
- **前端 React/Next.js 项目**：使用 Vercel AI SDK
- **Python 项目**：使用 LiteLLM 或 OpenAI SDK
- **需要特定功能**：使用厂商专用 SDK

**相关资源**：
- [OpenAI SDK 文档](https://github.com/openai/openai-node)
- [Vercel AI SDK 文档](https://sdk.vercel.ai/docs)
- [LiteLLM 文档](https://docs.litellm.ai/)
- Midscene 代码：`midscene/packages/core/src/ai-model/service-caller/index.ts`

**标签**：#SDK #OpenAI #Vercel #LiteLLM #最佳实践

