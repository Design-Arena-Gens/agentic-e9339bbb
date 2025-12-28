"use client";

import { useState } from "react";
import type { EmailGuess } from "@/lib/emailFinder";

interface ResultCardProps {
  guess: EmailGuess;
  index: number;
}

const confidenceCopy: Record<EmailGuess["confidence"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low"
};

export function ResultCard({ guess, index }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(guess.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Clipboard error", error);
    }
  }

  return (
    <article className="result-card" aria-label={`Email hypothesis ${index + 1}`}>
      <div className="result-header">
        <span className="result-rank">#{index + 1}</span>
        <span className={`confidence confidence-${guess.confidence}`}>
          {confidenceCopy[guess.confidence]} confidence
        </span>
      </div>
      <h3 className="result-address">{guess.address}</h3>
      <div className="result-meta">
        <span>Pattern: {guess.patternLabel}</span>
        <span>Score: {(guess.score * 100).toFixed(0)}%</span>
      </div>
      {guess.rationale.length > 0 && (
        <ul className="result-rationales">
          {guess.rationale.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      <button className="copy-button" onClick={handleCopy}>
        {copied ? "Copied" : "Copy"}
      </button>
    </article>
  );
}
