# SJG college prep

The college visit and open-house planner: a sortable/filterable table of 34 schools (`index.html`), a sourced profile page per school (`schools/`), and a map (`map.html`). Open `index.html` in a browser to view it — no server required.

Data lives as one Markdown file per school in `data/schools/`. After editing a school's file (or adding/removing one), regenerate the site:

```
npm install   # once
npm run build
```

See `CLAUDE.md` for the full data/build format.

https://gryffindorhammer.github.io/sjg-college-prep/
