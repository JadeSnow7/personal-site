export type AgentTraceStage = 'User Input' | 'Planner' | 'Tool Call' | 'Validator' | 'Response';

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  message: string;
  trace: AgentTraceStage[];
  simulated: true;
}
