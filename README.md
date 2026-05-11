# Clinique Bouchard — Patient Journey Film

A 4-minute presentation film of the complete patient care process at Clinique Bouchard (Marseille), built as a React prototype rendered in the browser via Babel standalone.

## Run locally

Serve the directory with any static HTTP server (file:// will not work because of CORS on the JSX scripts and audio):

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

Click the "Click to begin" overlay to start the synchronised voice-over, scene animation, and subtitles.

## Controls

- `Space` — play / pause
- `← →` — seek
- `0` — restart
- Click the timeline at the bottom to scrub

## Files

- `index.html` / `Patient Journey Film.html` — entry point (same content)
- `animations.jsx` — `<Stage>`, timeline, transitions, Ken Burns / fade primitives
- `scenes.jsx` — every scene (Marseille, Clinique, Surgeons, Coordination, Phase 1, Surgery, Phase 3, Closing)
- `narration.js` — subtitle cues + audio sync
- `assets/` — photos, illustrations, and `narration.mp3`
