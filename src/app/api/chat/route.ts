
import { createOpenAI, openai } from '@ai-sdk/openai';
import { streamText, generateText, type UIMessage, type Message } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json() as { messages: Message[] }

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse()
}