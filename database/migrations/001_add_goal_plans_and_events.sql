-- Migration to add goal plans, financial events, and journal entries tables

CREATE TABLE goal_plans (
  id TEXT PRIMARY KEY,
  goal_id TEXT,
  summary TEXT,
  monthly_contribution REAL,
  timeline_months INTEGER,
  created_at TIMESTAMP
);

CREATE TABLE financial_events (
  id TEXT PRIMARY KEY,
  event_type TEXT,
  impact_json TEXT,
  created_at TIMESTAMP
);

CREATE TABLE journal_entries (
  id TEXT PRIMARY KEY,
  content TEXT,
  created_at TIMESTAMP
); 