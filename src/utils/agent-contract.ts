import type { ChatRequest, ChatResponse } from '../types/agent';

/** Reserved contract only. No endpoint is implemented in the static milestone. */
export const CHAT_ENDPOINT = '/api/chat' as const;
export type { ChatRequest, ChatResponse };
