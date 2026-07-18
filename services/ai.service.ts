export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeRequestOptions {
  systemPrompt: string;
  messages: ChatMessage[];
  maxTokens?: number;
  model?: string;
}

export interface ClaudeResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const DEFAULT_MAX_TOKENS = 1500;

export async function callClaude(
  options: ClaudeRequestOptions
): Promise<ClaudeResponse> {
  const {
    systemPrompt,
    messages,
    maxTokens = DEFAULT_MAX_TOKENS,
    model = DEFAULT_MODEL,
  } = options;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set. Add it to your .env.local file.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error ${response.status}: ${error}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
    usage: { prompt_tokens: number; completion_tokens: number };
  };

  const text = data.choices[0]?.message.content ?? "";

  return {
    content: text,
    inputTokens: data.usage.prompt_tokens,
    outputTokens: data.usage.completion_tokens,
  };
}