# SJG college prep

The college visit and open-house planner: a sortable/filterable table of 34 schools (`index.html`), a sourced profile page per school (`schools/`), and a map (`map.html`). Open `index.html` in a browser to view it — no server required.

Data lives as one Markdown file per school in `data/schools/`. After editing a school's file (or adding/removing one), regenerate the site:

```
npm install   # once
npm run build
```

See `CLAUDE.md` for the full data/build format.

https://gryffindorhammer.github.io/sjg-college-prep/

## Confirmed-event calendar

[`booked-college-events.ics`](booked-college-events.ics) is the calendar source for events explicitly marked **Booked** in the planner. Download it and open it with Google Calendar, Apple Calendar, Outlook, or another calendar app to import the events.

It currently contains:

- University of Rochester virtual information session — August 26, 2026, 7:00–8:00 PM ET
- Princeton University virtual visit — August 27, 2026, 7:00–8:00 PM ET
- UC Berkeley information session — August 27, 2026, 3:00–4:00 PM ET
- Wesleyan University virtual information session — September 10, 2026, 7:00–8:00 PM ET
- University of Toronto “Ask Our Students Anything” virtual information session — September 17, 2026, 7:00–8:00 PM ET

Both events use a one-hour duration because the source planner records a start time but not an end time. Publicly listed visit days and open houses are intentionally excluded until someone has registered for them.
