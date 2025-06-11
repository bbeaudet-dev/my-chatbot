import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SYSTEM_PROMPT } from '../../../lib/puzzle-state'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    console.log('Received chat request:', { messageCount: messages.length })

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in chat route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}