import { z } from "zod";

export const sendChatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000),
  conversationId: z.string().optional(),
});

export const createConversationSchema = z.object({
  title: z.string().min(1).max(100),
});

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
