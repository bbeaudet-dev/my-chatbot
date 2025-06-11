import { NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { SYSTEM_PROMPT } from '../../../lib/puzzle-state'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    console.log('Received chat request:', { messageCount: messages.length })

    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error in chat route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}