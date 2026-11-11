# NABRA | نبرة

**MEDATHON 2026 · Track 3 · Bilingual voice-assessment prototype**

NABRA demonstrates how a specialist can compare Arabic voice tasks and review the evidence behind an illustrative observation. The source here reproduces the workflow of the [hosted demo](https://nabra-medathon.aishahabunaja.chatgpt.site/), reorganized into MVC for technical review.

## Run locally

Open `dist/index.html` in a desktop browser. To rebuild or run the checks, use Node.js 20 or newer; no package installation is needed.

```sh
npm run build
npm test
```

The build embeds the JavaScript, styles and licensed fonts in the HTML so the reviewer can open it directly as a file. The downloadable prototype starts a fresh visit and excludes current-session inputs.

## MVC structure

| Layer | Source | Responsibility |
| --- | --- | --- |
| Model | `src/model.cjs` | Patient-history validation, task states, simulated results and workflow transitions. No DOM or browser APIs. |
| View | `src/view.cjs`, `src/index.template.html`, `src/styles.css` | HTML rendering, Arabic and English copy, evidence and comparison views, accessibility and print layout. |
| Controller | `src/controller.cjs` | Connects browser actions to the model and view; manages timers, speech playback, printing and downloads. |

`scripts/build.cjs` bundles the three modules for the browser. `checks/flow.cjs` checks the data entry and retry flow, sample-case isolation, HTML escaping, accessible evidence labels and download behavior.

## What to review

1. Open **Try a sample case** to reach **Specialist review**. Select a task and compare the two readings.
2. Open **Preliminary assessment** and read **Why did this pattern appear?**. Each illustrative score links to the corresponding example segment.
3. Use **Print / save as PDF** to preview the assessment with scores, segment excerpts and any specialist note.
4. To exercise the full flow, start a fresh assessment using fictional details. One simulated task intentionally prompts for a retry.

## Prototype boundaries

- The scores, waveform, marked timings, quality checks and preliminary finding are scripted examples. The project does not capture microphone audio, run a trained model, or establish a diagnosis.
- The sample case uses the browser's Arabic text-to-speech when available. It reads the task or selected excerpt; it is not a patient recording and is not synchronized to the illustrative waveform.
- History is context for the specialist in this version; it does not change the simulated finding. Use fictional information only. The app stores session state in memory, not in a database.
- No dataset was used to train or validate this prototype. See [data selection and bias review](docs/data-and-bias.md) for the planned checks.

Font attribution and license are included in `dist/THIRD_PARTY_NOTICES.txt` and the standalone HTML.
