import React from 'react';
import './DialogueText.css';

export type DialogueTextHandle = { finishTyping: () => boolean };

type Props = {
  text: string;
  onReveal: (character: string) => void;
  /** Called once when the whole line is visible (typed out or skipped). Drives lip-sync. */
  onComplete?: () => void;
};

const DialogueText = React.forwardRef<DialogueTextHandle, Props>(function DialogueText({ text, onReveal, onComplete }, ref) {
  const [length, setLength] = React.useState(0);
  const timer = React.useRef<number>();
  const delivered = React.useRef(0);
  const completed = React.useRef(false);

  React.useImperativeHandle(ref, () => ({
    finishTyping() {
      if (length >= text.length) return false;
      window.clearInterval(timer.current);
      delivered.current = text.length; // A skip paints the rest without speaking it.
      setLength(text.length);
      return true;
    },
  }), [length, text]);

  React.useEffect(() => {
    completed.current = false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      delivered.current = text.length;
      setLength(text.length);
      return;
    }
    let visible = 0;
    timer.current = window.setInterval(() => {
      setLength(++visible);
      if (visible >= text.length) window.clearInterval(timer.current);
    }, 18);
    return () => window.clearInterval(timer.current);
  }, [text]);

  React.useLayoutEffect(() => {
    // Only committed text can speak. Coalesced renders never replay a backlog.
    if (length > delivered.current) {
      delivered.current = length;
      onReveal(text[length - 1]);
    }
    if (length >= text.length && !completed.current) {
      completed.current = true;
      onComplete?.();
    }
  }, [length, text, onReveal, onComplete]);

  return <span className="dialogue-text">
    <span className="dialogue-measure" aria-hidden="true">{text}</span>
    <span>{text.slice(0, length)}</span>
  </span>;
});

export default DialogueText;
