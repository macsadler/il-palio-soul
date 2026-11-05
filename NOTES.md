# L'Anima del Palio: what exists, sources, what is "da verificare"

A static site with no build step, served from the repo root (`index.html`). It is the successor to the "pretty" prototype
(macsadler/palio-preview-mijxdh, read-only): it keeps all of the prototype's plumbing and adds a heart layer on top.

Credit on every page: *Dati e storie del Palio: archivio di Orlando Papei, www.ilpalio.org, CC BY-NC 4.0*.
No ads, no tracking, no commercial links. No hotlinked images: `<img>`/`<image>` tags pointing to ilpalio.org were stripped on import.

## Structure
| Path | What it is | Source |
|---|---|---|
| `index.html` | Home: search, last Palio, today in history, countdown, 17 shields, "numeri che raccontano" + **Campo-at-dusk ring** linking to the 17 contrada pages + **La porta di oggi** (one archive sentence per day) | prototype + `assets/wonder.js` |
| `timeline.html` | All Palii from vittorie.htm, filters + **decade scrubber with colour spark** | prototype + heart layer |
| `contrade/*.html` (17) | Contrada pages + **Il filo della storia** (scrubbable victory thread, longest wait), **Chi l'ha fatta vincere** (winning jockeys and horses), **Amiche e rivali** (quotes + Fonte, links to the serial), **Testa a testa** (links to compare) | prototype + heart layer |
| `jockeys/*.html` (~595) | Jockey profiles + **career arc**, debut and last race, contrade ridden, victories, **I duelli** (riders met most often, who won), who it left behind / who won when it ran | prototype + heart layer |
| `horses/*.html` (~1290) | Horse profiles + **race cards** and jockeys | prototype + heart layer |
| `races/*.html` (~757) | Race pages + **la fine di un'attesa** (years since the winner's previous win), **starting gate**, **same day in other years**, prev/next | prototype + heart layer |
| `stats/`, `rivalries.html` | Statistics, times, "Amiche e rivali" map + **La corsa dei secoli** (drag or play the years), **Le grandi attese** (longest waits), **Chi aspetta oggi** (years since last win); all derivato | prototype + heart layer |
| `compare.html` | **New**: contrada vs contrada (two timelines, head to head, waits, rivalry/alliance quotes) | heart layer |
| `campo.html` | **New**: the Campo experience (flag ring, contrada worlds, serialized rivalry stories, Oggi nel Palio, quiz, wins by century, fastest times); links to the real pages | own text paraphrasing rivali_*.htm; vinti.htm; tempi.htm |
| `archive/` (~60 page types) | All archive page types. Heavy, image-only types (postcard_viewer, postcard_gallery, papei_genealogy, pallini_sonnets, coffee_cups, liquor_bottles, palio_books, other_palio_prose, quercegrossa) keep only their index lists; each item links to its **archivio originale** on www.ilpalio.org. The search index links them the same way. | prototype |

## Tools (re-runnable)
- `tools/import_prototype.py /path/to/pretty`: imports the prototype, strips image hotlinks, rewrites heavy types to originals.
- `tools/build_data.py`: builds `assets/palio-data.js` (757 races with entry lists, jockey and horse names) from `races/*.html`, and `assets/palio-meta.js` (flag colours and words, rivalries, alliances) from `rivalries.html`.
- `tools/inject_wonder.py`: adds `assets/wonder.js` to every page; regenerates `compare.html`.
- `tools/linkcheck.py`: checks local links (0 real broken links; 3 hits are JS template strings in campo.html).
- Every page also has the floating **✦ Meraviglia** button (random race, rivalry, alliance quote or jockey) and the nav links **Il Campo** and **Confronta**. Search also finds the Campo, the comparison page and the 13 serials.
Rebuild order: import, then build_data, then inject_wonder.

## Truth rules as applied
- Official win totals come **only from vinti.htm** (on the contrada pages, home and stats; Oca 65, Chiocciola 49, Tartuca 47½…).
- Heart-layer counts ("vittorie nelle schede", waits, head to head, career arcs) are **derivato** from the race pages and labelled so.
  After merging 31 duplicate race pages (postponed races with two pages), 12 contrade match vinti.htm exactly. Differences (race records vs vinti.htm): Chiocciola 48/49, Civetta 34/33, Lupa 39/38, Onda 46/45½, Tartuca 47/47½ (the halves are a shared Palio). Every heart-layer count says "derivato".
- "Attesa più lunga" is computed only between wins present in the race records; gaps in early centuries may come from missing records.
- Rivalry status ("in essere / estinta / sporadica") is as stated on rivali.htm, written in 2001–2002, not checked against today.
- Quotes are short and credited, each with a Fonte link to its archive page.

## Da verificare
- `campo.html` now takes contrada colours from the archive arms page (araldica.htm, via palio-meta.js), quoted with Fonte.
- Emblem drawings in campo.html are free stylisations, not official heraldry.
- Fastest times in campo.html: parsed from tempi.htm; asterisks on some times were dropped, meaning unknown.
- No city facts (streets, churches, fountains, museums, terzi) have been added yet: none to verify.

## Not done yet / next
- Image-only archive types are not rebuilt locally; they link to their originals on ilpalio.org.
- Horse genealogies: the horse pages carry no parentage data, so none are shown. Jockey families: no structured data yet.
- Terzi map, territories, streets, churches, fountains, museums: not built (would need "da verificare" on every item).
- Heart-layer IT/EN: the toggle reloads the page so the new language applies.
- campo.html stories are Italian only (the interface is IT/EN).
- Ideas: bring the 13 serials directly into rivalries.html (not only links); "accadde oggi" on contrada pages.
