interface AgentChatProps {
  messages: { role: 'user' | 'assistant'; text: string }[];
  draft: string;
  onDraftChange: (draft: string) => void;
  onSubmit: (event: { preventDefault: () => void }) => void;
  busy: boolean;
}

export default function AgentChat({ messages, draft, onDraftChange, onSubmit, busy }: AgentChatProps) {
  return <section className="agent-chat" aria-labelledby="conversation-title">
    <div className="agent-panel-heading"><div><p className="eyebrow">Conversation / simulated</p><h2 id="conversation-title" className="display-face mt-2 text-3xl">Conversation</h2></div><span className="mock-badge">MOCK UI</span></div>
    <div className="agent-messages" aria-live="polite" aria-atomic="false">{messages.map((message, index) => <div className={message.role === 'user' ? 'agent-message user' : 'agent-message assistant'} key={`${message.role}-${index}`}><span className="agent-message-label">{message.role === 'user' ? 'YOU' : 'SIMULATED AGENT'}</span><p>{message.text}</p></div>)}</div>
    <form className="agent-form" onSubmit={onSubmit}><label className="sr-only" htmlFor="agent-message">Message the simulated agent</label><textarea id="agent-message" name="message" rows={3} value={draft} onChange={(event) => onDraftChange(event.target.value)} placeholder="Try: map the constraints for a small tool" disabled={busy} /><div className="flex items-center justify-between gap-3"><span className="text-xs text-[var(--muted)]">No network · deterministic response</span><button className="button button-signal" type="submit" disabled={busy || !draft.trim()}>{busy ? 'Running…' : 'Run simulation'} <span aria-hidden="true">↗</span></button></div></form>
  </section>;
}
