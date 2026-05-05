---
description: "Use when working on the holiday-childcare project"
---
# Holiday Childcare Project

## Project Overview
A Single Page Application (SPA) to provide information on holiday childcare sessions avaialable for each day, including venue information and session schedules. This will only be done  for the weekdays of the weeks starting on the 1st of June and ending on the 12 of June. 

## Stack
- **svelte-kit**
- **grafitti** for UI styling (bun install @drop-in/graffiti)
- **bun** for package management

## Conventions

### Data
- Venue and session data lives in `childcare_session.json` at the project root
- Do not hardcode venue names or addresses — always read from the JSON file
 

## Running the Project
```bash
bun run dev
```
