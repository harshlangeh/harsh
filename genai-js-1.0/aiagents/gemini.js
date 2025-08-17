import 'dotenv/config';
import OpenAI from 'openai';
import { exec } from 'child_process';

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Tool executor
async function executeCommand(cmd = "") {
  return new Promise((resolve) => {
    exec(cmd, (error, data) => {
      if (error) {
        resolve(`⚠️ error running command: ${error.message}`);
      } else {
        resolve(data);
      }
    });
  });
}

function cleanJSON(raw) {
  if (!raw) return raw;

  raw = raw.trim();

  if (raw.startsWith("```json")) {
    raw = raw.replace(/^```json\s*/i, "");
  }
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```\s*/i, "");
  }
  if (raw.endsWith("```")) {
    raw = raw.replace(/```$/, "");
  }

  return raw.trim();
}

const toolMap = {
  executeCommand: executeCommand
};

const SYSTEM_PROMPT = `
You are an AI assistant.
Your goal is to solve the user's problem step by step in a structured JSON format.

You must always respond in this format:
{
  "step": "START" | "THINK" | "OBSERVE" | "OUTPUT" | "TOOL",
  "content": "string",
  "toolName": "string (only if step = TOOL)",
  "input": "string (only if step = TOOL)"
}

Rules:
- Always valid JSON, never plain text.
- Always respond with valid JSON only, without any markdown, backticks, or explanations.
- One step per response.
- If using a tool, wait for its response before continuing.
`;

const messages = [
  { role: "system", content: SYSTEM_PROMPT },
  { role: "user", content: "create a folder name myapp and inside it create a simple timer clock in html css and js" }
];

async function main() {
  while (true) {
    const result = await client.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: messages
    });

    let rawContent = result.choices[0].message.content;
    const cleaned = cleanJSON(rawContent);

    let parsedContent;
    try {
      parsedContent = JSON.parse(cleaned);
      console.log("✅ Parsed JSON:", parsedContent);
    } catch (err) {
      console.error("❌ Still invalid JSON:", cleaned);
      break; // stop loop if parsing fails
    }

    // Push stringified JSON back into messages
    messages.push({
      role: 'assistant',
      content: JSON.stringify(parsedContent)
    });

    // Handle steps
    if (parsedContent.step === "START") {
      console.log("🔥", parsedContent.content);
      continue;
    }

    if (parsedContent.step === "THINK") {
      console.log("\t🧠", parsedContent.content);
      continue;
    }

    if (parsedContent.step === "TOOL") {
      const toolToCall = parsedContent.toolName;
      if (!toolMap[toolToCall]) {
        messages.push({
          role: "developer",
          content: JSON.stringify({ step: "OBSERVE", content: `❌ Tool not found: ${toolToCall}` })
        });
        continue;
      }

      const responseFromTool = await toolMap[toolToCall](parsedContent.input);

      messages.push({
        role: "developer",
        content: JSON.stringify({ step: "OBSERVE", content: responseFromTool })
      });

      continue;
    }

    if (parsedContent.step === "OBSERVE") {
      console.log("👀", parsedContent.content);
      continue;
    }

    if (parsedContent.step === "OUTPUT") {
      console.log("🤖", parsedContent.content);
      break;
    }
  }
}

main();
