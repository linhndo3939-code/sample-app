export type Note = {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
}

export type NoteInput = {
    title: string
    content: string
}

// This points the frontend to your live Azure API
const BASE_URL = 'https://buckeye-api-linhn.azurewebsites.net';

async function extractErrorMessage(response: Response): Promise<string> {
    try {
        const data = await response.json()
        if (data && typeof data === 'object') {
            if (typeof data.detail === 'string') return data.detail
            if (typeof data.title === 'string') return data.title
        }
    } catch {
        // fall through
    }
    return `Request failed with status ${response.status}`
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...init,
    })
    if (!response.ok) {
        const message = await extractErrorMessage(response)
        throw new Error(message)
    }
    if (response.status === 204) return undefined as T
    return (await response.json()) as T
}

export function listNotes(): Promise<Note[]> {
    return request<Note[]>(`${BASE_URL}/api/notes`)
}

export function getNote(id: string): Promise<Note> {
    return request<Note>(`${BASE_URL}/api/notes/${id}`)
}

export function createNote(input: NoteInput): Promise<Note> {
    return request<Note>(`${BASE_URL}/api/notes`, {
        method: 'POST',
        body: JSON.stringify(input),
    })
}

export function updateNote(id: string, input: NoteInput): Promise<Note> {
    return request<Note>(`${BASE_URL}/api/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
    })
}

export function deleteNote(id: string): Promise<void> {
    return request<void>(`${BASE_URL}/api/notes/${id}`, { method: 'DELETE' })
}