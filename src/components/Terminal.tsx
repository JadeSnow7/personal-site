import { useEffect, useState } from 'react';

type TerminalLine = { command: string; output: string[] };

const transcript: TerminalLine[] = [
  { command: 'whoami', output: ['AI Engineer'] },
  { command: 'projects', output: ['Forge Studio', 'Agent Harness'] },
  { command: 'skills', output: ['Rust', 'Go', 'React', 'AI'] },
];

export default function Terminal() {
  // null is intentional: the server sends the complete transcript for no-JS readers.
  const [visibleLines, setVisibleLines] = useState<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setVisibleLines(transcript.length);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    setVisibleLines(0);
    transcript.forEach((_, index) => {
      timers.push(setTimeout(() => setVisibleLines(index + 1), 420 * (index + 1)));
    });
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const renderedLines = visibleLines === null ? transcript : transcript.slice(0, visibleLines);

  return <section className="terminal" aria-labelledby="terminal-title" aria-describedby="terminal-description">
    <div className="terminal-chrome"><span className="terminal-lights" aria-hidden="true"><i /><i /><i /></span><span id="terminal-title">runtime-console / local</span><span className="terminal-ready">READY</span></div>
    <p id="terminal-description" className="sr-only">A static profile transcript. It reveals one command result at a time when motion is allowed.</p>
    <div className="terminal-body" role="log" aria-live="off">
      {renderedLines.map((line) => <div className="terminal-command" key={line.command}><div><span className="terminal-prompt" aria-hidden="true">$</span> <span>{line.command}</span></div><ul>{line.output.map((output) => <li key={output}>{output}</li>)}</ul></div>)}
      {visibleLines !== null && visibleLines < transcript.length && <span className="terminal-cursor" aria-hidden="true">▋</span>}
    </div>
  </section>;
}
