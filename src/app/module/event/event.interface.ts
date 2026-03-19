export interface ICreateEventPayload {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  eventType: 'PUBLIC' | 'PRIVATE';
  fee?: number;
  isPaid?: boolean;
}

export interface IUpdateEventPayload {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  venue?: string;
  eventType?: 'PUBLIC' | 'PRIVATE';
  fee?: number;
  isPaid?: boolean;
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

export interface IEventFilterPayload {
  eventType?: 'PUBLIC' | 'PRIVATE';
  isPaid?: boolean;
  status?: string;
  search?: string;
}