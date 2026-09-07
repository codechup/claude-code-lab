# artifacts/

Sample data for the m19-01-artifacts and m19-04-dataviz labs — publishing an Artifact and
charting real-looking data, without needing this repo's own CLI/API running to produce it.

## `task-activity.csv`

30 days of synthetic daily activity for a labtrack-like project: `date`, `tasks_created`,
`tasks_completed`, `tasks_overdue` (backlog overdue count at end of day), `avg_priority`
(mean priority of tasks created that day, 0–3). Generated with a fixed random seed so it's
reproducible, not pulled from a real deployment — there is no real labtrack usage data to
publish, and there shouldn't be (this is a public teaching repo).

Use it to practice:

- Publishing an Artifact that reads this file and renders a chart (created vs. completed
  over time, a backlog/overdue trend line) — m19-01-artifacts.
- `/dataviz` chart discipline on a small, realistic dataset — m19-04-dataviz.

The columns are intentionally plain (no nulls, no ragged rows) so the lab is about the
chart, not about data-cleaning.
