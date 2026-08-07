# Compact Portfolio Table Design QA

## Evidence

- Source visual truth: `/var/folders/29/_6y39w6x0ljdk6mq32422sn40000gn/T/codex-clipboard-2d2d0c23-b189-4c59-851a-187a501a398c.png`
- Implementation screenshot: `/tmp/triochar-compact-qa/portfolio-compact-viewport.png`
- Combined source and implementation comparison: `/tmp/triochar-compact-qa/table-comparison.jpg`
- Source pixels: 1228 x 1038; focused source crop: 1085 x 842
- Implementation pixels: 1585 x 927
- CSS viewport: 1600 x 936; device density: 1x
- State: published portfolio with seven projects, all filters closed

## Full-view comparison

The source shows the table extending beyond its white frame, cutting off the Price per Credit column and requiring horizontal scrolling. The implementation keeps the same nine columns inside the frame and shows the complete price column.

## Focused comparison

- Layout and spacing: column widths, horizontal padding, and icon size were reduced. At a 1280px desktop viewport the table scroller reports equal client and scroll widths, so there is no horizontal overflow.
- Fonts and typography: the existing font families, sizes, weights, line heights, and header treatment are unchanged. Long project, pathway, and eligibility values wrap naturally.
- Colors and tokens: no palette, border, background, or shadow tokens changed.
- Image quality and assets: existing project icons remain sharp and use the same source assets; only their displayed diameter changed from 56px to 48px.
- Copy and content: all labels and project values are unchanged.
- Interaction: the Status filter still opens and exposes Spot, Forward, and Offtake.
- Console: no errors were observed. A pre-existing development-only LCP warning for the header logo remains outside this change.

## Comparison history

- Pass 1 finding [P2]: the previous 1400px minimum width clipped the final column and forced horizontal scrolling on desktop.
- Fix: reduced the table minimum width to 1040px, tightened explicit column widths and cell padding, and reduced the icon diameter.
- Pass 2 evidence: all nine columns are visible in `/tmp/triochar-compact-qa/portfolio-compact-viewport.png`; measured client width and scroll width are both 1238px at a 1280px viewport.

## Findings

- P0: none
- P1: none
- P2: none remaining

## Final result

passed
