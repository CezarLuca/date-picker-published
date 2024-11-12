export interface Event {
    id: number;
    date: string;
    name: string;
    email: string;
    description: string;
    created_at: string;
    personal_notes?: string;
}
