import { generateId, type Message } from 'ai'
import { existsSync, mkdirSync } from 'fs'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import { type PuzzleStats } from '../lib/puzzle-state'

interface ChatData {
    messages: Message[]
    stats?: PuzzleStats
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
    const content = await readFile(getChatFile(id), 'utf8')
    const data = JSON.parse(content) as ChatData
    return data
}

export async function saveChat({
    id,
    messages,
    stats,
    metadata
}: {
    id: string
    messages: Message[]
    stats?: PuzzleStats
    metadata?: {
        startTime: string
        endTime?: string
        puzzleId?: string
    }
}): Promise<void> {
    const data: ChatData = {
        messages,
        stats,
        metadata
    }
    await writeFile(getChatFile(id), JSON.stringify(data, null, 2))
}