import { openai } from '@ai-sdk/openai'
import { appendResponseMessages, createIdGenerator, streamText, type Message } from 'ai'
import { saveChat } from '../../tools/chat-store'
import { riddlemasterPrompt } from '../../lib/prompts'
import { NextResponse } from 'next/server'

interface ChatProps {
  messages: Message[]
  id: string
}

export const POST = async (req: Request) => {
  try {
    const { messages, id }: ChatProps = await req.json() as ChatProps

    const result = streamText({
      model: openai('gpt-4'),
      system: riddlemasterPrompt,
      messages,
      async onFinish({ response }) {
        await saveChat({
          id,
          messages: appendResponseMessages({
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
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}