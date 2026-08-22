import type { AgentTraceStage } from '../types/agent';

interface AgentTraceProps {
  activeStage: number;
  stages: AgentTraceStage[];
}

export default function AgentTrace({ activeStage, stages }: AgentTraceProps) {
  return <aside className="agent-trace" aria-labelledby="trace-title"><div className="agent-panel-heading"><div><p className="eyebrow">Execution / simulated</p><h2 id="trace-title" className="display-face mt-2 text-3xl">Agent Trace</h2></div><span className="status-dot" aria-label="Simulation ready" /></div><p className="mt-5 text-sm leading-6 text-[var(--muted)]">A visible protocol sketch, not a live model run.</p><ol className="agent-trace-list" aria-label="Simulated execution stages">{stages.map((stage, index) => <li key={`${stage}-${index}`} className={index <= activeStage ? 'is-complete' : ''}><span className="agent-trace-index">{String(index + 1).padStart(2, '0')}</span><span>{stage}</span>{index < stages.length - 1 && <span className="agent-trace-arrow" aria-hidden="true">↓</span>}</li>)}</ol><p className="mock-disclaimer">SIMULATED TRACE · NO TOOL WAS CALLED</p></aside>;
}
