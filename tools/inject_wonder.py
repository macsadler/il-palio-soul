#!/usr/bin/env python3
"""Add the heart layer (assets/wonder.js) to every page and generate compare.html from the timeline shell."""
import os,re
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
n=0
for root,_,fs in os.walk(R):
    if '/.git' in root or '/tools' in root: continue
    for f in fs:
        if not f.endswith('.html') or f=='campo.html': continue
        p=os.path.join(root,f); s=open(p,encoding='utf-8').read()
        if 'assets/wonder.js' in s: continue
        m=re.search(r'data-root="([^"]*)"',s)
        if not m or '</body>' not in s: continue
        s=s.replace('</body>','<script src="%sassets/wonder.js" defer></script>\n</body>'%m[1],1)
        open(p,'w',encoding='utf-8').write(s); n+=1
print('injected',n)
t=open(R+'/timeline.html',encoding='utf-8').read()
a=t.find('<main'); b=t.find('</main>')
main='''<main id="main" class="wrap">
<p class="crumbs"><a href="contrade/index.html" data-i18n="nav.contrade">Contrade</a></p>
<h1>Contrada contro Contrada</h1>
<p class="lede">Scegli due Contrade: le loro vittorie una accanto all'altra nel tempo, i Palii corsi insieme, le attese più lunghe e, dove l'archivio ne parla, la loro storia di amicizia o rivalità. <span class="muted">Choose two contrade and compare them.</span></p>
<div id="w-compare" class="w-sec"><p class="w-small">Caricamento…</p></div>
<noscript><p>Questa pagina richiede JavaScript. Le stesse informazioni sono nelle pagine delle <a href="contrade/index.html">Contrade</a>.</p></noscript>
</main>'''
c=t[:a]+main+t[b+7:]
c=re.sub(r'<title>[^<]*</title>','<title>Confronta · Archivio del Palio di Siena</title>',c)
c=c.replace(' aria-current="page"','')
open(R+'/compare.html','w',encoding='utf-8').write(c); print('compare.html')
# search: add the heart-layer pages and the 13 rivalry serials
import json
p=R+'/assets/search-index.js'; s=open(p,encoding='utf-8').read()
d=json.loads(s[s.find('['):s.rfind(']')+1]); d=[x for x in d if x.get('k')!='Anima']
c=open(R+'/campo.html',encoding='utf-8').read()
add=[{'t':'Il Campo al tramonto','u':'campo.html','k':'Anima','n':'campo piazza tramonto bandiere contrade quiz oggi nel palio','w':3},
     {'t':'Contrada contro Contrada (confronta)','u':'compare.html','k':'Anima','n':'confronta compare contrada contro contrada testa a testa','w':3}]
for m in re.finditer(r'\{k:"(\w+)",a:"(\w+)",b:"(\w+)",since:"[^"]*",\s*t:\["([^"]+)"',c):
    add.append({'t':'%s × %s — %s'%(m[2].title(),m[3].title(),m[4]),'u':'campo.html#/rivalita/'+m[1],'k':'Anima','n':('%s %s rivalità racconto %s'%(m[2],m[3],m[4])).lower(),'w':2})
open(p,'w',encoding='utf-8').write('window.PALIO_INDEX='+json.dumps(add+d,ensure_ascii=False,separators=(',',':'))+';\n'); print('search +',len(add))
