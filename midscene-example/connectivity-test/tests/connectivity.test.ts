import { describe, it, expect, vi, beforeAll } from "vitest";
import dotenv from "dotenv";
import OpenAI, { AzureOpenAI } from "openai";
import { join } from "node:path";
import { localImg2Base64 } from "@midscene/shared/img";
import {  globalModelConfigManager } from "@midscene/shared/env";
import { AIActionType, callAIWithObjectResponse } from "@midscene/core/ai-model";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";

// read and parse .env file
const result = dotenv.config({
  debug: true,
});
if (result.error) {
  throw result.error;
}

// uncomment to see the parsed result. It may include some credentials.
// console.log(".env file parsed result");
// console.log(result.parsed);

vi.setConfig({
  testTimeout: 30000,
});

const imagePath = join(__dirname, "some_logo.png");
const imageBase64 = localImg2Base64(imagePath);

// 这里注意的是要使用的 qwen3-vl-plus 模型这类支持多模态的模型
const model = process.env.MIDSCENE_MODEL_NAME || "gpt-4o";
describe("直接使用 OpenAI SDK", () => {
  it(`基础调用 - ${model}`, async () => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    });
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: "你好，你好吗？" }],
    });
    // console.log(response.choices[0].message.content);
    expect(response.choices[0].message.content).toBeTruthy();
  });

  it(`图片输入 - ${model}`, async () => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    });

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "user", content: "告诉我这张图片里有什么" },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
                detail: 'high'
              },
            },
          ],
        },
      ],
    });
    console.log(response.choices[0].message.content);
    expect(response.choices[0].message.content).toBeTruthy();
  });
});

describe("使用 Midscene 封装的 OpenAI SDK", () => {
  it("调用以获取 JSON 对象", async () => {
    const result = await callAIWithObjectResponse<{ yyy: string }>(
      [
        {
          role: "user",
          content:
            "告诉我这张图片里有什么？请以 JSON 格式返回 {yyy: string}",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
                detail: 'high'
              },
            },
          ],
        },
      ],
      AIActionType.EXTRACT_DATA,
      globalModelConfigManager.getModelConfig('default')
    );
    console.log(result.content.yyy);
    expect(result.content.yyy.length).toBeGreaterThan(5);
  });
});

// // remove the ".skip" if you want to test Azure OpenAI Service
// describe.skip("Azure OpenAI Service by ADT Credential", () => {
//   it("basic call", async () => {
//     // sample code: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/samples/cookbook/simpleCompletionsPage/app.js
//     const scope = process.env.MIDSCENE_AZURE_OPENAI_SCOPE;
//     if (typeof scope !== "string") {
//       throw new Error("MIDSCENE_AZURE_OPENAI_SCOPE is required");
//     }

//     const credential = new DefaultAzureCredential();
//     const tokenProvider = getBearerTokenProvider(credential, scope);

//     const extraAzureConfig = JSON.parse(
//       process.env.MIDSCENE_AZURE_OPENAI_INIT_CONFIG_JSON || "{}"
//     );
//     // console.log(extraAzureConfig);
//     const openai = new AzureOpenAI({
//       azureADTokenProvider: tokenProvider,
//       ...extraAzureConfig,
//     });

//     const response = await openai.chat.completions.create({
//       model: model,
//       messages: [{ role: "user", content: "Hello, how are you?" }],
//     });

//     expect(response.choices[0].message.content).toBeTruthy();
//   });
// });
