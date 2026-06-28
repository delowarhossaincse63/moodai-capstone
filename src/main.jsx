import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import {
  ACTIVITIES,
  EMOTIONS,
  ENERGY_LEVELS,
  createEntry,
  deleteEntry,
  getEntries,
  saveEntry,
  seedDemoData
} from "./moodStorage";
import {
  buildMoodSummary,
  formatDate,
  getActivityImpact,
  getMoodLabel,
  getStreak,
  sortEntries
} from "./moodAnalytics";

const tabs = [
  { id: "log", label: "Log" },
  { id: "dashboard", label: "Dashboard" },
  { id: "companion", label: "Companion" },
  { id: "history", label: "History" }
];

function App() {
  const [entries, setEntries] = useState(() => sortEntries(getEntries()));
  const [activeTab, setActiveTab] = useState("log");
  const summary = useMemo(() => buildMoodSummary(entries), [entries]);

  function refreshEntries(nextEntries = getEntries()) {
    setEntries(sortEntries(nextEntries));
  }

  function handleSave(entry) {
    saveEntry(entry);
    refreshEntries();
    setActiveTab("dashboard");
  }

  function handleDelete(id) {
    deleteEntry(id);
    refreshEntries();
  }

  function handleDemoData() {
    refreshEntries(seedDemoData());
    setActiveTab("dashboard");
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Privacy-first mental wellness</p>
          <h1>MoodAI</h1>
          <p className="intro">
            Log your day, understand your patterns, and ask an AI companion for
            insight based on your own mood data.
          </p>
        </div>
        <div className="header-stats" aria-label="Mood summary">
          <Stat label="Entries" value={entries.length} />
          <Stat label="Streak" value={`${getStreak(entries)} days`} />
          <Stat
            label="Avg mood"
            value={summary.totalEntries ? summary.averages.mood.toFixed(1) : "--"}
          />
        </div>
      </header>

      <nav className="tabbar" aria-label="Primary navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === "log" && (
          <MoodLogger onSave={handleSave} onDemoData={handleDemoData} />
        )}
        {activeTab === "dashboard" && (
          <Dashboard entries={entries} summary={summary} onDemoData={handleDemoData} />
        )}
        {activeTab === "companion" && (
          <AICompanion entries={entries} summary={summary} onDemoData={handleDemoData} />
        )}
        {activeTab === "history" && (
          <History entries={entries} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MoodLogger({ onSave, onDemoData }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    mood: 3,
    emotions: [],
    activities: [],
    sleepHours: 7,
    energy: 3,
    note: ""
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleList(field, value) {
    setForm((current) => {
      const exists = current[field].includes(value);
      return {
        ...current,
        [field]: exists
          ? current[field].filter((item) => item !== value)
          : [...current[field], value]
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(createEntry(form));
    setForm((current) => ({
      ...current,
      mood: 3,
      emotions: [],
      activities: [],
      sleepHours: 7,
      energy: 3,
      note: ""
    }));
  }

  return (
    <section className="workspace two-column">
      <form className="panel" onSubmit={handleSubmit}>
        <div className="section-heading">
          <p className="eyebrow">Daily check-in</p>
          <h2>How was today?</h2>
        </div>

        <label className="field">
          <span>Date</span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => updateField("date", event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Mood: {getMoodLabel(Number(form.mood))}</span>
          <input
            type="range"
            min="1"
            max="5"
            value={form.mood}
            onChange={(event) => updateField("mood", Number(event.target.value))}
          />
        </label>

        <div className="field">
          <span>Emotions</span>
          <div className="chip-grid">
            {EMOTIONS.map((emotion) => (
              <button
                type="button"
                key={emotion}
                className={form.emotions.includes(emotion) ? "chip selected" : "chip"}
                onClick={() => toggleList("emotions", emotion)}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span>Activities</span>
          <div className="chip-grid">
            {ACTIVITIES.map((activity) => (
              <button
                type="button"
                key={activity}
                className={form.activities.includes(activity) ? "chip selected" : "chip"}
                onClick={() => toggleList("activities", activity)}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        <div className="inline-fields">
          <label className="field">
            <span>Sleep hours</span>
            <input
              type="number"
              min="0"
              max="16"
              step="0.5"
              value={form.sleepHours}
              onChange={(event) => updateField("sleepHours", Number(event.target.value))}
            />
          </label>
          <label className="field">
            <span>Energy</span>
            <select
              value={form.energy}
              onChange={(event) => updateField("energy", Number(event.target.value))}
            >
              {ENERGY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span>Journal note</span>
          <textarea
            rows="5"
            value={form.note}
            onChange={(event) => updateField("note", event.target.value)}
            placeholder="What stood out today?"
          />
        </label>

        <div className="actions">
          <button className="primary" type="submit">
            Save entry
          </button>
          <button className="secondary" type="button" onClick={onDemoData}>
            Load demo data
          </button>
        </div>
      </form>

      <aside className="panel quiet">
        <h2>What MoodAI stores</h2>
        <p>
          Entries stay in your browser localStorage. The AI chat only receives
          aggregated statistics and recent notes when you choose to ask a
          question.
        </p>
        <div className="privacy-list">
          <span>Local mood entries</span>
          <span>Computed trend summary</span>
          <span>Server-side Claude API key</span>
        </div>
      </aside>
    </section>
  );
}

function Dashboard({ entries, summary, onDemoData }) {
  if (!entries.length) {
    return <EmptyState onDemoData={onDemoData} />;
  }

  const recent = entries.slice(0, 7).reverse();
  const activityImpact = getActivityImpact(entries);

  return (
    <section className="workspace">
      <div className="metric-grid">
        <Metric title="Average mood" value={summary.averages.mood.toFixed(1)} detail={summary.trend.label} />
        <Metric title="Average sleep" value={`${summary.averages.sleep.toFixed(1)}h`} detail="per logged day" />
        <Metric title="Average energy" value={summary.averages.energy.toFixed(1)} detail="out of 5" />
        <Metric title="Current streak" value={`${getStreak(entries)}`} detail="days" />
      </div>

      <div className="dashboard-grid">
        <section className="panel wide">
          <div className="section-heading">
            <p className="eyebrow">Last seven entries</p>
            <h2>Mood trend</h2>
          </div>
          <div className="bar-chart">
            {recent.map((entry) => (
              <div className="bar-item" key={entry.id}>
                <div
                  className="bar"
                  style={{ height: `${entry.mood * 18}%` }}
                  aria-label={`${formatDate(entry.date)} mood ${entry.mood}`}
                />
                <span>{new Date(entry.date).toLocaleDateString("en", { weekday: "short" })}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Frequency</p>
            <h2>Top emotions</h2>
          </div>
          <RankedList items={summary.topEmotions} emptyLabel="No emotions logged yet." />
        </section>

        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Signals</p>
            <h2>Activity impact</h2>
          </div>
          <RankedList
            items={activityImpact.map((item) => ({
              label: item.activity,
              value: `${item.averageMood.toFixed(1)} avg`
            }))}
            emptyLabel="Add activities to compare mood patterns."
          />
        </section>

        <section className="panel wide">
          <div className="section-heading">
            <p className="eyebrow">Distribution</p>
            <h2>Mood balance</h2>
          </div>
          <div className="distribution">
            {[1, 2, 3, 4, 5].map((mood) => {
              const count = entries.filter((entry) => entry.mood === mood).length;
              return (
                <div key={mood} className="distribution-row">
                  <span>{getMoodLabel(mood)}</span>
                  <div className="track">
                    <div
                      style={{
                        width: `${entries.length ? (count / entries.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <strong>{count}</strong>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}

function Metric({ title, value, detail }) {
  return (
    <div className="metric">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function RankedList({ items, emptyLabel }) {
  if (!items.length) {
    return <p className="muted">{emptyLabel}</p>;
  }

  return (
    <div className="ranked-list">
      {items.slice(0, 6).map((item) => (
        <div key={item.label} className="ranked-item">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function AICompanion({ entries, summary, onDemoData }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask me about your mood trend, activities that may be helping, or warning signs in your recent entries."
    }
  ]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");

  async function askCompanion(event) {
    event.preventDefault();
    const question = input.trim();
    if (!question || status === "loading") return;

    const nextMessages = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setStatus("loading");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          messages: nextMessages.filter((message) => message.role !== "system")
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "AI companion unavailable.");
      }
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply || "I could not generate a response." }
      ]);
      setStatus("idle");
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error.message ||
            "I could not reach the AI service. Check your API key and try again."
        }
      ]);
      setStatus("error");
    }
  }

  if (!entries.length) {
    return <EmptyState onDemoData={onDemoData} />;
  }

  return (
    <section className="workspace two-column companion-layout">
      <div className="panel chat-panel">
        <div className="section-heading">
          <p className="eyebrow">Claude-powered support</p>
          <h2>AI Companion</h2>
        </div>
        <div className="chat-log" aria-live="polite">
          {messages.map((message, index) => (
            <article key={`${message.role}-${index}`} className={`message ${message.role}`}>
              <span>{message.role === "assistant" ? "MoodAI" : "You"}</span>
              <p>{message.content}</p>
            </article>
          ))}
          {status === "loading" && (
            <article className="message assistant">
              <span>MoodAI</span>
              <p>Thinking through your patterns...</p>
            </article>
          )}
        </div>
        <form className="chat-form" onSubmit={askCompanion}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="What patterns do you see this week?"
          />
          <button className="primary" type="submit" disabled={status === "loading"}>
            Ask
          </button>
        </form>
      </div>

      <aside className="panel">
        <h2>Context sent to AI</h2>
        <div className="summary-list">
          <span>Total entries: {summary.totalEntries}</span>
          <span>Average mood: {summary.averages.mood.toFixed(1)}</span>
          <span>Trend: {summary.trend.label}</span>
          <span>Top emotions: {summary.topEmotions.map((item) => item.label).join(", ") || "None"}</span>
          <span>Raw localStorage database: not sent</span>
        </div>
      </aside>
    </section>
  );
}

function History({ entries, onDelete }) {
  return (
    <section className="workspace">
      <div className="section-heading">
        <p className="eyebrow">Local journal</p>
        <h2>Entry history</h2>
      </div>
      {!entries.length ? (
        <p className="muted">No entries yet.</p>
      ) : (
        <div className="history-list">
          {entries.map((entry) => (
            <article className="history-card" key={entry.id}>
              <div>
                <time>{formatDate(entry.date)}</time>
                <h3>{getMoodLabel(entry.mood)} mood</h3>
                <p>{entry.note || "No journal note for this day."}</p>
                <div className="mini-tags">
                  {[...entry.emotions, ...entry.activities].map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <button className="danger" onClick={() => onDelete(entry.id)}>
                Delete
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState({ onDemoData }) {
  return (
    <section className="workspace">
      <div className="empty-state">
        <p className="eyebrow">No mood data yet</p>
        <h2>Start with today&apos;s check-in or load sample entries.</h2>
        <p>
          The dashboard and AI companion become more useful after several days
          of mood, sleep, energy, emotion, and activity data.
        </p>
        <button className="primary" onClick={onDemoData}>
          Load demo data
        </button>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
