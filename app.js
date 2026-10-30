// rain-check: looks up a city, gets the hourly chance of rain, and says
// whether to bring an umbrella. No API key needed (Open-Meteo is free).

const RAIN_THRESHOLD = 50; // % chance at which we say "bring one"
const HOURS_AHEAD = 12;

const form = document.getElementById("search");
const input = document.getElementById("city");
const statusEl = document.getElementById("status");
const result = document.getElementById("result");

async function findCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: HTTP ${res.status}`);
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;
  const c = data.results[0];
  return { name: c.name, country: c.country, lat: c.latitude, lon: c.longitude };
}

async function getForecast(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&hourly=precipitation_probability&forecast_days=2&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast failed: HTTP ${res.status}`);
  const data = await res.json();

  // Keep the next HOURS_AHEAD hours, starting from the current hour at that place.
  const times = data.hourly.time;
  const probs = data.hourly.precipitation_probability;
  const localHour = nowAt(data.utc_offset_seconds);
  let start = times.findIndex((t) => t >= localHour);
  if (start < 0) start = 0;
  return times.slice(start, start + HOURS_AHEAD).map((t, i) => ({
    time: t,
    chance: probs[start + i] ?? 0,
  }));
}

// Current time at the forecast location, formatted like Open-Meteo's "2026-10-31T14:00".
function nowAt(offsetSeconds) {
  const local = new Date(Date.now() + offsetSeconds * 1000);
  return local.toISOString().slice(0, 13) + ":00";
}

function show(place, hours, usedSample) {
  const max = Math.max(...hours.map((h) => h.chance));
  const wettest = hours.find((h) => h.chance === max);

  document.getElementById("place").textContent = place;
  const answer = document.getElementById("answer");
  answer.textContent = max >= RAIN_THRESHOLD ? "Yes, bring one." : "No, you're fine.";
  answer.className = "answer " + (max >= RAIN_THRESHOLD ? "yes" : "no");
  document.getElementById("detail").textContent =
    `Highest chance of rain: ${max}% around ${wettest.time.slice(11, 16)}.`;

  const bars = document.getElementById("hours");
  bars.innerHTML = "";
  for (const h of hours) {
    const col = document.createElement("div");
    col.className = "hour" + (h.chance >= RAIN_THRESHOLD ? " wet" : "");
    col.innerHTML =
      `<span class="pct">${h.chance}%</span>` +
      `<span class="bar" style="height:${Math.max(h.chance, 2)}%"></span>` +
      `<span class="time">${h.time.slice(11, 13)}</span>`;
    bars.appendChild(col);
  }

  const note = document.getElementById("note");
  note.hidden = !usedSample;
  note.textContent = usedSample ? "The weather service didn't respond, so this is saved sample data." : "";

  result.hidden = false;
}

async function check(name) {
  statusEl.textContent = "Checking…";
  result.hidden = true;
  try {
    const city = await findCity(name);
    if (!city) {
      statusEl.textContent = `Couldn't find "${name}". Check the spelling?`;
      return;
    }
    const hours = await getForecast(city.lat, city.lon);
    show(`${city.name}, ${city.country}`, hours, false);
    localStorage.setItem("lastCity", name);
    statusEl.textContent = "";
  } catch (err) {
    // Never let the demo die: fall back to saved data.
    console.warn("Weather API failed, using sample data", err);
    show(SAMPLE.place, SAMPLE.hours, true);
    statusEl.textContent = "";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  check(input.value.trim());
});

document.getElementById("demo").addEventListener("click", () => {
  input.value = "Singapore";
  check("Singapore");
});

// Start with ?city=London from the URL if given, otherwise the last city checked.
const startCity = new URLSearchParams(location.search).get("city") || localStorage.getItem("lastCity");
if (startCity) {
  input.value = startCity;
  check(startCity);
}
