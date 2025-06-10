import { openai } from '@ai-sdk/openai'
import { appendResponseMessages, createIdGenerator, streamText, type Message } from 'ai'
import { saveChat } from '../../../tools/chat-store'

export async function POST(req: Request) {
  const { messages, id } = await req.json() 

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
    async onFinish({ response }) {
      await saveChat({
        id,
        messages:appendResponseMessages({
          messages,
          responseMessages: response.messages,
        })
      })
    },
    experimental_generateMessageId: createIdGenerator({
      prefix: 'msgs',
      size: 16,
    })
  })

  return result.toDataStreamResponse({
    sendReasoning: true,
    sendSources: true,
  })
}