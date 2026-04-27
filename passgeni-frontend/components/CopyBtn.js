import { useState, useCallback } from 'react';
import { IcCheck } from '../lib/icons.js';

/**
 * CopyBtn — unified copy button used globally.
 *
 * Style matches the random password generator copy button:
 *   - transparent bg with #1e1e1e border
 *   - IBM Plex Mono, 11px, uppercase
 *   - on copy: border + text → #C8FF00, bg → #C8FF0010
 *
 * Usage:
 *   <CopyBtn text="text to copy" />
 *   <CopyBtn text="text" label="COPY KEY" copiedLabel="✓ KEY COPIED" />
 */
const DEFAULT_COPIED_LABEL = <><IcCheck size={11} color="#C8FF00" /> COPIED</>;

export default function CopyBtn({
  text,
  label = 'COPY',
  copiedLabel = DEFAULT_COPIED_LABEL,
  style = {},
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      className={`copy-btn${copied ? ' copied' : ''}`}
      onClick={copy}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      disabled={!text}
      style={{ opacity: text ? 1 : 0.3, ...style }}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
