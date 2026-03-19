import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    venue: z.string().min(1, 'Venue is required'),
    eventType: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
    fee: z.number().min(0, 'Fee must be positive').default(0),
    isPaid: z.boolean().default(false),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    venue: z.string().optional(),
    eventType: z.enum(['PUBLIC', 'PRIVATE']).optional(),
    fee: z.number().min(0).optional(),
    isPaid: z.boolean().optional(),
    status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  }),
});