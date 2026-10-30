# rain-check

Tells you whether to bring an umbrella: type a city, get the chance of rain for the next 12 hours. Example hackathon project for hackpack; keep it small and simple.

## Stack
- Plain HTML, CSS and JavaScript. No build step, no framework, no packages.
- Weather from the Open-Meteo API (free, no key).
- Hosted on GitHub Pages from the `main` branch.

## Running it
- Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000
- `?city=London` in the URL runs a search on load.

## Where things are
- `index.html`: the page
- `app.js`: city lookup, forecast, rendering
- `demo-data.js`: saved forecast used if the API fails
- `style.css`: styling

## Rules
- Don't add a framework, build tool or npm packages.
- Every API call must fall back to `demo-data.js` on failure, so the demo never breaks.
- Keep the page usable on a phone screen.
