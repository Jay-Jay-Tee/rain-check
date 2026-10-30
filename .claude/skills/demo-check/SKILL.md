---
name: demo-check
description: Checks whether a hackathon project is ready to demo and submit, covering the build, secrets, README and deployment, and reports problems without fixing them. Use when the user is about to submit, present or demo, or asks if the project is ready.
---

# Check the project is ready to demo

Run the checks below, then give a short report. **Don't fix anything without asking first.** Near a deadline, the user decides what's worth changing.

## Checks

### Build
- Find the build command (`package.json` scripts, `requirements.txt`, the README) and run it.
- Note any errors. Warnings don't matter unless they break something.

### Secrets
- Run `git ls-files` and check that no `.env` files, keys or credentials are tracked (`.env.example` is fine).
- Search tracked files for things that look like API keys, such as long strings starting with `sk-`, `AIza` or `ghp_`.
- Check `.gitignore` includes `.env` and the dependency folder (`node_modules/` or `.venv/`).

### Environment variables
- List every environment variable the code reads.
- Check each one is in `.env.example`, so the deployed site and teammates know to set it.

### README
Check the README has:
- a one-line description
- a link to the live demo
- how to run it locally
- the team members

### Demo path
- Look for leftover test data, `console.log` spam, or "TODO" text visible in the UI.
- If there's a deployed URL in the README, say whether it should be opened to confirm it works (you may not be able to check it yourself).

### Git
- Run `git status`. Uncommitted changes won't be in the submission.
- Check the current branch has been pushed.

## Report

Use three groups:

- **Must fix before submitting**: build failures, committed secrets, uncommitted work.
- **Should fix if there's time**: missing README sections, missing env vars in `.env.example`.
- **Fine**: what passed.

End with the single most important thing to do next.
