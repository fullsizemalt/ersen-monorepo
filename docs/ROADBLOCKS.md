# Roadmap Roadblocks & Future Work

The following features were implemented as **UI Shells** (high-fidelity mockups) in the Overnight Feature Sprint. To make them fully functional, the following backend integrations are required:

## Phase D: Deep Integrations

### 1. Media Stack (`TraktWidget`, `LetterboxdWidget`)

- **Blocked On**:
  - **Trakt API Key**: Need User Client ID/Secret.
  - **Letterboxd API**: Public API is closed beta; likely need RSS feed parsing or unauthorized scraper (fragile) vs official API access.
- **Next Steps**:
  - Add "Settings" tab to widget to input API keys.
  - Implement OAuth flow for Trakt.
  - Build RSS parser for Letterboxd public feeds.

### 2. Health Stack (`SleepWidget`, `FitnessRingWidget`)

- **Blocked On**:
  - **Apple Health / Google Fit API**: Requires backend OAuth and sensitive scopes.
  - **Data Ingestion**: Need a mobile companion app or a "data dumper" script (e.g., Shortcuts automation) to push JSON data to Ersen API.
- **Next Steps**:
  - Create a simple API endpoint `/api/health/sync` to accept JSON payloads.
  - Write an iOS Shortcut to push Apple Health data to that endpoint daily.

### 3. Social Stack (`SocialFeedWidget`)

- **Blocked On**:
  - **AT Protocol (Bluesky)**: Needs `bot` or `user` login credentials.
  - **Mastodon Instance**: Needs instance URL and access token.
- **Next Steps**:
  - Implement `atproto` package in backend for authenticated feeds.
  - Add instance configuration to user settings.

---

## Maintenance & Optimization

- **Bundle Size**: Registry is growing large. Ensure `React.lazy` is effectively code-splitting.
- **Mobile Layout**: Check new 2x3 and 2x4 widgets on mobile screens.
