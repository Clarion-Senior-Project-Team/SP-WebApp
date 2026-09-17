import { useState } from "react";
import "./App.css";

// ============================================================
// TABS — the list the sidebar buttons get built from
// ============================================================
//one object per sidebar button.
// "key" has to match one of the cases checked down in the JSX below
// (activeTab === "dashboard", activeTab === "clock", etc.) — that's how
// clicking a button decides which content shows up.
//
// This lives OUTSIDE the App() function on purpose. It never changes, so
// there's no reason for React to recreate it every time the component
// re-renders — it just gets defined once when the file loads.
const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "clock", label: "Time Clock" },
  { key: "schedule", label: "Schedule" },
  { key: "timeoff", label: "Time Off" },
  { key: "staff", label: "Staff" },
];

// Small formatting helpers. Plain JavaScript
// functions, nothing React-specific about them, so they also live outside
// the component.
function pad(n) {
  return String(n).padStart(2, "0");
}
function timeLabel(d) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function dateLabel(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function App() {
  // ============================================================
  // STATE — every value here is something that can change while the
  // app is running, and changing it automatically triggers React to
  // re-render whatever JSX depends on it. Here,
  // we just update the state and React figures out what needs to
  // change on screen.
  //
  // useState("dashboard") means: "this value starts out as 'dashboard',
  // and give me a variable to read it (activeTab) plus a function to
  // change it (setActiveTab)."
  const [activeTab, setActiveTab] = useState("dashboard");
  const [clockedIn, setClockedIn] = useState(false);
  const [shiftStart, setShiftStart] = useState(null); // the Date() from when "Clock in" was pressed
  const [foodProgram, setFoodProgram] = useState(false);
  const [entries, setEntries] = useState([]); // every completed shift: {date, clockIn, clockOut, hours, food}

  // ============================================================
  // TIME CLOCK — the actual clock-in/clock-out logic
  // ============================================================
  // just using setState calls instead of reaching into the page and editing it by hand.
  function handleClockClick() {
    if (!clockedIn) {
      // --- Starting a shift ---
      setShiftStart(new Date());
      setClockedIn(true);
    } else {
      // --- Ending a shift: this is where the real math happens ---
      const end = new Date();
      // (end - start) on two Date objects gives milliseconds, so divide
      // down to hours: 1000ms/sec, 60sec/min, 60min/hour.
      const hours = (end - shiftStart) / 1000 / 60 / 60;

      const newEntry = {
        date: dateLabel(end),
        clockIn: timeLabel(shiftStart),
        clockOut: timeLabel(end),
        hours: hours.toFixed(2), // round to 2 decimal places, e.g. 4.03
        food: foodProgram,
      };

      // Add the new shift to the FRONT of the list, so the newest entry
      // shows up at the top of the table. `(prev) => [newEntry, ...prev]`
      // means "take whatever the list currently is, and return a brand
      // new list with newEntry stuck on the front of it" — React wants a
      // new array here rather than editing the old one in place.
      setEntries((prev) => [newEntry, ...prev]);

      setClockedIn(false);
      setFoodProgram(false);
    }
  }

  // ============================================================
  // CSV EXPORT — turns entries into a real, downloadable .csv file
  // ============================================================

  // CSV files break if a value itself contains a comma, a quote, or a
  // line break (the file would misread it as extra columns). This wraps
  // any such value in quotes and doubles up any quote characters inside
  // it, which is the standard way to "escape" a CSV field safely.
  function csvField(v) {
    const s = String(v ?? ""); // turn the value into text; ?? "" means null/undefined become an empty string instead of the literal word "null"
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; // if it contains a comma/quote/newline, wrap it in quotes and double any quotes inside; otherwise leave it plain
  }

  function handleExportCsv() {
    const header = ["Date", "Clock In", "Clock Out", "Hours", "Food Program"]; // the column titles — becomes the file's first row
    const rows = entries.map((e) => [e.date, e.clockIn, e.clockOut, e.hours, e.food ? "Yes" : "No"]); // turns each shift object into a plain array of values, same order as the header
    // Every row (including the header) becomes one comma-joined line;
    // \r\n between lines is the CSV-standard line ending.
    const csv = [header, ...rows].map((r) => r.map(csvField).join(",")).join("\r\n"); // run every value through csvField() first, then glue everything into one big text blob

    // There's no server here, so the "download" trick is: wrap the CSV
    // text in a Blob (an in-browser file-like object), give it a
    // temporary URL, and click an invisible link pointing at that URL
    // with a `download` attribute — this is what makes the browser save
    // it as a file instead of navigating to it.
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); // packages the CSV text as an in-memory "file" the browser understands
    const url = URL.createObjectURL(blob); // creates a temporary browser-only URL that points at that in-memory file
    const link = document.createElement("a"); // builds an invisible link element — never shown on the page, just used to trigger the save
    link.href = url; // points the link at the blob's temporary URL
    link.download = `hours-${dateLabel(new Date())}.csv`; // setting `download` (instead of just visiting the link) is what makes the browser save it as a file, and this sets the filename
    document.body.appendChild(link); // the link has to actually be in the page for .click() to work in every browser
    link.click(); // programmatically "clicks" it, which is what pops the real save-file download
    document.body.removeChild(link); // done with it — remove the invisible link from the page
    URL.revokeObjectURL(url); // free up the temporary URL now that we're done with it
  }

  // ============================================================
  // THE ACTUAL PAGE — everything below is JSX: it looks like HTML, but
  // it's really JavaScript. Anything inside {curly braces} is plain JS
  // being dropped into the markup — a variable, a function call, an
  // expression, whatever.
  // ============================================================
  return (
    <div className="app-shell">
      {/* ---- Sidebar ---- */}
      <div className="sidebar">
        <div className="brand">
          <span>Rutledge</span>
        </div>

        <div className="nav">
          {/* Instead of writing 5 buttons by hand, this loops over the
              TABS list from the top of the file and makes one <button>
              per entry. `key={t.key}` is something React specifically
              asks for whenever you build a list of elements with .map —
              it's how React tells each item apart when the list changes. */}
          {TABS.map((t) => (
            <button
              key={t.key}
              className={"nav-item" + (activeTab === t.key ? " active" : "")}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">Prototype — no data saved</div>
      </div>

      {/* ---- Main content ---- */}
      <div className="content">
        {/* Only one of these blocks ever actually renders — each one is
            guarded by `activeTab === "..." && (...)`. In JavaScript,
            `condition && somethingElse` evaluates to `somethingElse` when
            condition is true, and evaluates to `false` (which React just
            renders as nothing) when it's not. That's the whole trick
            behind how tab-switching works here — no hiding/showing CSS
            classes needed, React just doesn't put the other tabs on the
            page at all. */}

        {activeTab === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <p className="subtitle">Overview — nothing logged yet.</p>
            <div className="stat-row">
              <div className="card">
                <div className="stat-label">Hours logged</div>
                <div className="stat-value">—</div>
              </div>
              <div className="card">
                <div className="stat-label">Pending time-off requests</div>
                <div className="stat-value">—</div>
              </div>
              <div className="card">
                <div className="stat-label">Food-program hours</div>
                <div className="stat-value">—</div>
              </div>
            </div>
            <div className="card">
              <div className="card-title">
                <span>Time-off requests</span>
              </div>
              <div className="empty-state">
                <div className="title">Nothing here yet</div>
                <div className="sub">Requests will show up here once submitted.</div>
              </div>
            </div>
          </>
        )}

        {activeTab === "clock" && (
          <>
            <div className="toolbar">
              <h1 style={{ margin: 0 }}>Time entries</h1>
              <button className="btn btn-ghost" onClick={handleExportCsv}>
                ⬇ Download CSV
              </button>
            </div>

            <div className="card" style={{ maxWidth: 360, marginBottom: 20 }}>
              <div className="card-title">
                <span>Time clock</span>
              </div>
              <label className="check-row">
                {/* `checked` + `onChange` together is how a checkbox stays
                    "controlled" by React state instead of managing its own
                    value — React state is always the source of truth. */}
                <input
                  type="checkbox"
                  checked={foodProgram}
                  onChange={(e) => setFoodProgram(e.target.checked)}
                  disabled={clockedIn}
                />
                Attribute this shift to the food program
              </label>
              <button
                className={"btn btn-full " + (clockedIn ? "btn-danger" : "btn-primary")}
                onClick={handleClockClick}
              >
                {clockedIn ? "Clock out" : "Clock in"}
              </button>
            </div>

            <div className="card">
              <div className="card-title">
                <span>Today's entries</span>
              </div>

              {/* Same "if empty, show one thing; otherwise show the
                  table" logic as the HTML version — just as a normal
                  JavaScript if/else that decides what JSX to return,
                  instead of toggling display:none/table by hand. */}
              {entries.length === 0 ? (
                <div className="empty-state">
                  <div className="title">No time entries yet</div>
                  <div className="sub">Clock in above to add one.</div>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Clock in</th>
                      <th>Clock out</th>
                      <th>Hours</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* .map turns the entries array into a <tr> per
                        shift — this is the React way of drawing a list.
                        No manual innerHTML-building needed like the
                        plain-JS version had to do. */}
                    {entries.map((e, i) => (
                      <tr key={i}>
                        <td>{e.date}</td>
                        <td style={{ fontFamily: "var(--font-mono)" }}>{e.clockIn}</td>
                        <td style={{ fontFamily: "var(--font-mono)" }}>{e.clockOut}</td>
                        <td style={{ fontFamily: "var(--font-mono)" }}>{e.hours}</td>
                        <td>{e.food && <span className="pill">Food</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === "schedule" && (
          <>
            <div className="toolbar">
              <h1 style={{ margin: 0 }}>Weekly schedule</h1>
              <button className="btn btn-primary">+ Add shift</button>
            </div>
            <div className="card">
              <div className="empty-state">
                <div className="title">No shifts scheduled</div>
                <div className="sub">Add the first shift to get started.</div>
              </div>
            </div>
          </>
        )}

        {activeTab === "staff" && (
          <>
            <div className="toolbar">
              <h1 style={{ margin: 0 }}>Staff</h1>
              <button className="btn btn-primary">+ Add employee</button>
            </div>
            <div className="card">
              <div className="empty-state">
                <div className="title">No staff added yet</div>
                <div className="sub">Add your first employee to get started.</div>
              </div>
            </div>
          </>
        )}

        {activeTab === "timeoff" && (
          <>
            <div className="toolbar">
              <h1 style={{ margin: 0 }}>Time off</h1>
              <button className="btn btn-primary">+ Request time off</button>
            </div>
            <div className="card">
              <div className="empty-state">
                <div className="title">No requests here</div>
                <div className="sub">Submitted requests will show up here.</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
