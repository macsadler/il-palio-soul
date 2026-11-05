# L'Anima del Palio: what exists, sources, what is "da verificare"

A static site with no build step, served from the repo root (`index.html`). It is the successor to the "pretty" prototype
(macsadler/palio-preview-mijxdh, read-only): it keeps all of the prototype's plumbing and adds a heart layer on top.

Credit on every page: *Dati e storie del Palio: archivio di Orlando Papei, www.ilpalio.org, CC BY-NC 4.0*.
No ads, no tracking, no commercial links. No hotlinked images: `<img>`/`<image>` tags pointing to ilpalio.org were stripped on import.

## Structure
| Path | What it is | Source |
|---|---|---|
| `index.html` | Home: search, last Palio, today in history, countdown, 17 shields, "numeri che raccontano" + **Campo-at-dusk ring** (heart layer) linking to the 17 contrada pages | prototype + `assets/wonder.js` |
| `timeline.html` | All Palii from vittorie.htm, filters + **decade scrubber with colour spark** | prototype + heart layer |
| `contrade/*.html` (17) | Contrada pages + **Il filo della storia** (scrubbable victory thread, longest wait), **Amiche e rivali** (quotes + Fonte), **Testa a testa** | prototype + heart layer |
| `jockeys/*.html` (~595) | Jockey profiles + **career arc**, contrade ridden, victories, who it left behind / who won when it ran | prototype + heart layer |
| `horses/*.html` (~1290) | Horse profiles + **race cards** and jockeys | prototype + heart layer |
| `races/*.html` (~757) | Race pages + **starting gate**, **same day in other years**, prev/next | prototype + heart layer |
| `stats/`, `rivalries.html` | Statistics, times, "Amiche e rivali" map | prototype |
| `compare.html` | **New**: contrada vs contrada (two timelines, head to head, waits, rivalry/alliance quotes) | heart layer |
| `campo.html` | **New**: the Campo experience (flag ring, contrada worlds, serialized rivalry stories, Oggi nel Palio, quiz, wins by century, fastest times); links to the real pages | own text paraphrasing rivali_*.htm; vinti.htm; tempi.htm |
| `archive/` (~60 page types) | All archive page types. Heavy, image-only types (postcard_viewer, postcard_gallery, papei_genealogy, pallini_sonnets, coffee_cups, liquor_bottles, palio_books, other_palio_prose, quercegrossa) keep only their index lists; each item links to its **archivio originale** on www.ilpalio.org. The search index links them the same way. | prototype |

## Tools (re-runnable)
- `tools/import_prototype.py /path/to/pretty`: imports the prototype, strips image hotlinks, rewrites heavy types to originals.
- `tools/build_data.py`: builds `assets/palio-data.js` (757 races with entry lists, jockey and horse names) from `races/*.html`, and `assets/palio-meta.js` (flag colours and words, rivalries, alliances) from `rivalries.html`.
- `tools/inject_wonder.py`: adds `assets/wonder.js` to every page; regenerates `compare.html`.
- `tools/linkcheck.py`: checks local links (0 broken after import, apart from 2 JS template false positives in campo.html).
Rebuild order: import, then build_data, then inject_wonder.

## Truth rules as applied
- Official win totals come **only from vinti.htm** (on the contrada pages, home and stats; Oca 65, Chiocciola 49, Tartuca 47½…).
- Heart-layer counts ("vittorie nelle schede", waits, head to head, career arcs) are **derivato** from the race pages and labelled so.
  They can differ from vinti.htm (e.g. Oca 67 in the race records against 65 official) because the race records include races that vinti.htm counts differently. Each heart-layer section says so.
- "Attesa più lunga" is computed only between wins present in the race records; gaps in early centuries may come from missing records.
- Rivalry status ("in essere / estinta / sporadica") is as stated on rivali.htm, written in 2001–2002, not checked against today.
- Quotes are short and credited, each with a Fonte link to its archive page.

## Da verificare
- `campo.html` now takes contrada colours from the archive arms page (araldica.htm, via palio-meta.js), quoted with Fonte.
- Emblem drawings in campo.html are free stylisations, not official heraldry.
- Fastest times in campo.html: parsed from tempi.htm; asterisks on some times were dropped, meaning unknown.
- No city facts (streets, churches, fountains, museums, terzi) have been added yet: none to verify.

## Not done yet / next
- Image-only archive types are not rebuilt locally (they link to originals).
- Horse genealogies (no parsed parent data yet), jockey families.
- Terzi map with territories (only with "da verificare").
- Campo ring on the contrade index; IT/EN for the heart layer is applied at page load (toggle, then reload, to switch it).
- Episodes for the remaining 8 rivalry pages in campo.html.
