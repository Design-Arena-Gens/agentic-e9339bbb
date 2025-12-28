"use client";

import { FormEvent, useMemo, useState } from "react";
import { ResultCard } from "./components/ResultCard";
import type { FinderResponse } from "@/lib/emailFinder";

type ApiResponse =
  | { ok: true; result: FinderResponse }
  | { ok: false; error: string };

const DEFAULT_RESPONSE: FinderResponse = {
  normalizedDomain: "",
  guesses: [],
  searchQueries: [],
  actionPlan: []
};

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [domain, setDomain] = useState("");
  const [company, setCompany] = useState("");
  const [clues, setClues] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<FinderResponse>(DEFAULT_RESPONSE);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          lastName,
          domain,
          company,
          clues
        })
      });

      const data: ApiResponse = await res.json();
      if (!data.ok) {
        throw new Error(data.error);
      }
      setResponse(data.result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to generate hypotheses";
      setError(message);
      setResponse(DEFAULT_RESPONSE);
    } finally {
      setLoading(false);
    }
  }

  const hasResults = response.guesses.length > 0;

  const leadingGuesses = useMemo(
    () => response.guesses.slice(0, 6),
    [response.guesses]
  );

  return (
    <main>
      <div className="shell">
        <header className="hero">
          <div className="status-bar">
            <span className="dot" aria-hidden />
            Live agentic workflow
          </div>
          <h1>Email finder agent</h1>
          <p>
            Feed the agent with everything you know about a prospect and it will
            craft high-confidence email hypotheses, research prompts, and an
            actionable follow-up plan tuned for modern deliverability.
          </p>
        </header>

        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="input-grid">
            <div className="input-row">
              <label>
                <span>First name *</span>
                <input
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required={!lastName}
                />
              </label>
              <label>
                <span>Last name</span>
                <input
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required={!firstName}
                />
              </label>
            </div>

            <div className="input-row">
              <label>
                <span>Company domain *</span>
                <input
                  placeholder="acme.com"
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  required
                />
              </label>
              <label>
                <span>Company name</span>
                <input
                  placeholder="Acme Robotics"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </label>
            </div>

            <label>
              <span>Clues, hints or public footprint</span>
              <textarea
                placeholder="LinkedIn handle, press quotes, username patterns, prior email formats..."
                value={clues}
                onChange={(event) => setClues(event.target.value)}
              />
            </label>
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Synthesizing" : "Generate hypotheses"}
          </button>

          {error && <p style={{ color: "#ef4444" }}>{error}</p>}
        </form>

        <section className="results-section" aria-live="polite">
          <h2>Hypotheses</h2>
          {hasResults ? (
            <div className="results-grid">
              {leadingGuesses.map((guess, index) => (
                <ResultCard key={guess.address} guess={guess} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <strong>No hypotheses yet.</strong>
              <p>
                Provide at least a first or last name plus the company domain to
                activate the agent. Share any username patterns, press releases,
                or email clues you have for sharper deductions.
              </p>
            </div>
          )}
        </section>

        <div className="secondary-panel">
          <section>
            <h2>Research boosts</h2>
            <ul>
              {hasResults && response.searchQueries.length > 0 ? (
                response.searchQueries.map((query) => <li key={query}>{query}</li>)
              ) : (
                <li>
                  Add the prospect&apos;s company name or extra context to unlock
                  curated search queries.
                </li>
              )}
            </ul>
          </section>

          <section>
            <h2>Action plan</h2>
            <ul>
              {hasResults && response.actionPlan.length > 0 ? (
                response.actionPlan.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>
                  Hypotheses will generate a tactical outreach checklist once the
                  agent has enough context.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
