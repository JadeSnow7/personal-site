import { useEffect, useRef, useState } from 'react';
import AgentChat from './AgentChat';
import AgentTrace from './AgentTrace';
import type { AgentTraceStage } from '../types/agent';

const stages: AgentTraceStage[] = ['User Input', 'Planner', 'Tool Call', 'Validator', 'Response'];
const defaultMessage = 'This deterministic mock maps your prompt into a five-stage trace. A real model and tool runtime are intentionally not connected.';
type Message = { role: 'user' | 'assistant'; text: string };

export default function AgentDemo() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: defaultMessage }]);
  const [draft, setDraft] = useState('');
  const [activeStage, setActiveStage] = useState(4);
  const [busy, setBusy] = useState(false);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  useEffect(() => clearTimers, []);

  function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    const input = draft.trim();
    if (!input || busy) return;
    clearTimers();
    setBusy(true);
    setActiveStage(0);
    setMessages((current) => [...current, { role: 'user', text: `Input received: “${input}”` }]);
    setDraft('');
    timers.current = stages.slice(1).map((_, index) => window.setTimeout(() => setActiveStage(index + 1), 280 * (index + 1)));
    timers.current.push(window.setTimeout(() => {
      setMessages((current) => [...current, { role: 'assistant', text: 'Simulation complete: constraints captured, no external tool invoked.' }]);
      setBusy(false);
      clearTimers();
    }, 280 * stages.length + 80));
  }

  return <div className="agent-workbench"><AgentChat messages={messages} draft={draft} onDraftChange={setDraft} onSubmit={handleSubmit} busy={busy} /><AgentTrace activeStage={activeStage} stages={stages} /></div>;
}
