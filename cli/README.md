# Ersen CLI

The official command-line interface for Ersen.

## Installation

### Option 1: Using Bun (Recommended)

Bun makes the CLI super fast and allows compiling to a single binary.

**Development:**

```bash
bun install
bun run dev -- --help
```

**Production Binary (Standalone):**
Compile the CLI into a single file you can drop anywhere:

```bash
bun run compile
./ersen dashboard
```

### Option 2: Using Node/NPM

```bash
npm install
npm run build
npm link
```

## Usage

### Login

Authenticate with your Ersen account.

```bash
ersen login
```

### Dashboard

View your widgets in the terminal. The CLI uses a rich **TUI (Terminal User Interface)** powered by Ink, featuring dynamic grid layouts and live widget updates.

```bash
ersen dashboard
```

**Demo Mode**:
Run the dashboard without connecting to the backend (offline mode).

```bash
ersen dashboard --demo
```

## Development

Run in development mode:

```bash
npm run dev -- [command]
```
