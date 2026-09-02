# SJG college prep

The college visit and open-house planner: a sortable/filterable table of 33 schools with an inline map (`index.html`), and a sourced profile page per school (`schools/`). Open `index.html` in a browser to view it — no server required.

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

- Chicago college tour itinerary — The Study at University of Chicago, August 27–28, 2026; includes Thursday Hyde Park/UChicago orientation and Friday visit-to-Northwestern-to-ORD logistics
- Chicago college tour flight to Chicago — United UA 2294, LaGuardia (LGA) to Chicago O'Hare (ORD), August 27, 2026, 2:25 PM ET–4:09 PM CT (5:09 PM ET)
- Chicago college tour flight to New York — United UA 2605, Chicago O'Hare (ORD) to LaGuardia (LGA), August 28, 2026, 6:29 PM CT (7:29 PM ET)–9:54 PM ET
- Northwestern University in-person campus tour — August 28, 2026, 1:30–3:00 PM CT; check in at Segal Visitors Center, 1841 Sheridan Road, Evanston, IL 60208-0001
- Northwestern University College of Arts and Sciences information session — completed August 26, 2026, 4:30–5:30 PM ET (3:30–4:30 PM CT); notes on page 2
- University of Rochester virtual information session — completed August 26, 2026, 7:00–8:00 PM ET; notes on page 3
- University of Chicago in-person information session and tour — August 28, 2026, 9:00–10:45 AM CT; Rosenwald Hall, 1101 E 58th St, Chicago, IL 60637
- Case Western Reserve University online information session — completed September 1, 2026, 3:00–4:00 PM ET; notes on page 4
- Yale University virtual information session — completed September 1, 2026, 4:00–5:00 PM ET; notes on page 5
- Tufts University virtual information session — September 8, 2026, 4:00–5:00 PM ET
- Wesleyan University virtual information session — September 10, 2026, 7:00–8:00 PM ET
- UC Davis PIQ Tips for First-Year Applicants — September 11, 2026, 10:00–11:00 PM ET
- University at Buffalo information session — September 14, 2026, 3:30–4:30 PM ET
- Drexel University College of Arts & Sciences undergraduate virtual information session — September 14, 2026, 7:00–8:00 PM ET
- Penn State University Park information session — September 16, 2026, 9:00–10:00 PM ET
- University of Toronto “Ask Our Students Anything” virtual information session — September 17, 2026, 7:00–8:00 PM ET
- New York University virtual information session — September 29, 2026, 4:00–5:00 PM ET

Both events use a one-hour duration because the source planner records a start time but not an end time. Publicly listed visit days and open houses are intentionally excluded until someone has registered for them.
