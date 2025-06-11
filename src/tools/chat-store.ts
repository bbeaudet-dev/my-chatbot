import { generateId, type Message } from 'ai'
import { existsSync, mkdirSync } from 'fs'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'

interface ChatData {
    messages: Message[]
    metadata?: {
        startTime: string
        endTime?: string
        puzzleId?: string
    }
}

export async function createChat(): Promise<string> {
    const id = generateId()
    const initialData: ChatData = {
        messages: [],
        metadata: {
            startTime: new Date().toISOString()
        }
    }
    await writeFile(getChatFile(id), JSON.stringify(initialData, null, 2))
    return id
}

export function getChatFile(id: string): string {
    const chatDir = path.join(process.cwd(), '.chats')
    if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true })
    return path.join(chatDir, `${id}.json`)
}

export async function loadChat(id: string): Promise<ChatData> {
    const data = JSON.parse(await readFile(getChatFile(id), 'utf8')) as ChatData
    return data
}

export async function saveChat({
    id,
    messages,
    metadata
}: {
    id: string
    messages: Message[]
    metadata?: {
        startTime: string
        endTime?: string
        puzzleId?: string
    }
}): Promise<void> {
    const data: ChatData = {
        messages,
        metadata
    }
    await writeFile(getChatFile(id), JSON.stringify(data, null, 2))
}