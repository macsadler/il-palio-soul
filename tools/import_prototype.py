#!/usr/bin/env python3
"""Import the read-only 'pretty' prototype (macsadler/palio-preview-mijxdh) into this repo.
Usage: python3 tools/import_prototype.py /path/to/pretty
 - copies core entity pages + assets + light archive types
 - heavy/media-heavy archive types keep only their index pages, whose links point to the live originals at ilpalio.org
 - strips hotlinked <img> tags (no photo hotlinks), rewrites branding
"""
import os,re,shutil,sys,json
SRC=sys.argv[1]; DST=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAVY={'postcard_viewer','postcard_gallery','papei_genealogy','pallini_sonnets','coffee_cups','liquor_bottles','palio_books','other_palio_prose','quercegrossa'}
CORE=['contrade','jockeys','horses','races','stats','assets']
FILES=['index.html','timeline.html','rivalries.html']
def cp(a,b):
    os.makedirs(os.path.dirname(b),exist_ok=True); shutil.copyfile(a,b)
for d in CORE:
    shutil.copytree(os.path.join(SRC,d),os.path.join(DST,d),dirs_exist_ok=True)
for f in FILES: cp(os.path.join(SRC,f),os.path.join(DST,f))
for t in sorted(os.listdir(os.path.join(SRC,'archive'))):
    p=os.path.join(SRC,'archive',t)
    if os.path.isfile(p): cp(p,os.path.join(DST,'archive',t)); continue
    for f in os.listdir(p):
        if t in HEAVY and not re.match(r'index(-\d+)?\.html$',f): continue
        cp(os.path.join(p,f),os.path.join(DST,'archive',t,f))
# post-process
img=re.compile(r'<img[^>]*ilpalio\.org[^>]*>',re.I)
def orig(t,name): return 'https://www.ilpalio.org/'+name[:-5]+'.htm'
n=0
for root,_,fs in os.walk(DST):
    if '/.git' in root or '/tools' in root: continue
    for f in fs:
        if not f.endswith('.html') or f=='campo.html': continue
        p=os.path.join(root,f); s=open(p,encoding='utf-8').read(); o=s
        s=img.sub('',s)
        rel=os.path.relpath(root,os.path.join(DST,'archive'))
        t=rel.split(os.sep)[0] if not rel.startswith('..') else None
        def fix(m):
            h=m[1]; tgt=os.path.normpath(os.path.join(root,h))
            mm=re.search(r'archive/([^/]+)/([^/]+)\.html$',tgt)
            if mm and mm[1] in HEAVY and not os.path.exists(tgt):
                return 'href="https://www.ilpalio.org/%s.htm" target="_blank" rel="noopener"'%mm[2]
            return m[0]
        s=re.sub(r'href="([^"#?:]+\.html)"',fix,s)
        if t in HEAVY:
            s=re.sub(r'href="((?!index)[^"/:#]+)\.html"',lambda m:'href="https://www.ilpalio.org/%s.htm" target="_blank" rel="noopener"'%m[1],s)
        if s!=o: open(p,'w',encoding='utf-8').write(s); n+=1
print('rewrote',n)
# search index: heavy pages -> originals
p=os.path.join(DST,'assets','search-index.js'); s=open(p,encoding='utf-8').read()
d=json.loads(s[s.find('['):s.rfind(']')+1])
for x in d:
    m=re.match(r'archive/([^/]+)/([^/]+)\.html$',x['u'])
    if m and m[1] in HEAVY and not m[2].startswith('index'): x['u']='https://www.ilpalio.org/%s.htm'%m[2]
open(p,'w',encoding='utf-8').write('window.PALIO_INDEX='+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n')
