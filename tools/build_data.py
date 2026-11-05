#!/usr/bin/env python3
"""Extract compact race data from races/*.html (already derived from ilpalio.org by the prototype) -> assets/palio-data.js"""
import os,re,json,html
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MONTHS={'gennaio':1,'febbraio':2,'marzo':3,'aprile':4,'maggio':5,'giugno':6,'luglio':7,'agosto':8,'settembre':9,'ottobre':10,'novembre':11,'dicembre':12}
cid=lambda h:re.search(r'contrade/([a-z]+)\.html',h)
races=[];J={};H={}
for f in sorted(os.listdir(R+'/races')):
    if f=='index.html' or not f.endswith('.html'): continue
    s=open(R+'/races/'+f,encoding='utf-8').read()
    h1=html.unescape(re.sub(r'<[^>]+>','',re.search(r'<h1>(.*?)</h1>',s,re.S).group(1))).strip()
    y=re.search(r'(\d{4})',f); y=int(y[1]) if y else None
    if not y:
        y=re.search(r'(\d{4})',h1); y=int(y[1]) if y else None
    m=re.match(r'(\d+)\s+(\w+)',h1); d=int(m[1]) if m and m[2] in MONTHS else 0; mo=MONTHS.get(m[2],0) if m else 0
    if not mo:
        mm=re.search(r'(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)',h1); mo=MONTHS[mm[1]] if mm else 0
    win=re.search(r'badge win">.*?contrade/([a-z]+)\.html',s,re.S)
    typ='s' if re.search(r'straordinari',s[:6000],re.I) else 'o'
    parts=[]
    for tr in re.findall(r'<tr(?: class="win")?>.*?</tr>',s,re.S):
        if '<td>' not in tr: continue
        c=cid(tr)
        if not c: continue
        j=re.search(r'jockeys/([^"]+)\.html',tr); hh=re.search(r'horses/([^"]+)\.html',tr)
        for x,dct,pat in ((j,J,r'jockeys/[^"]+\.html">(.*?)</a>'),(hh,H,r'horses/[^"]+\.html">(.*?)</a>')):
            if x: dct[x[1]]=html.unescape(re.sub(r'<[^>]+>','',re.search(pat,tr,re.S)[1])).strip()
        parts.append([c[1],j[1] if j else '',hh[1] if hh else '',1 if 'class="win"' in tr[:30] else 0])
    # winner jockey/horse from timeline-less race: use winning row
    races.append([f[:-5],y,mo,d,typ,win[1] if win else '',h1,parts])
races.sort(key=lambda r:(r[1],r[2],r[3]))
out='window.PALIO_DATA='+json.dumps({'r':races,'j':J,'h':H},ensure_ascii=False,separators=(',',':'))+';\n'
open(R+'/assets/palio-data.js','w',encoding='utf-8').write(out);print(len(races),len(J),len(H),len(out)//1024,'KB',sum(1 for r in races if r[7]),'with entries')
# meta: colours/words of the 17 flags + rivalry/alliance entries, from rivalries.html (itself from ilpalio.org)
s=open(R+'/rivalries.html',encoding='utf-8').read()
d=json.loads(re.search(r'id="rv-data">(.*?)</script>',s,re.S)[1])
nodes={n['k'].lower():{'n':n['name'],'c':n['c'],'w':n['words']} for n in d['nodes']}
rels=[];alls=[]
for r in d['riv']['rels']:
    if r['type']=='rivalry': rels.append({'a':r['a'].lower(),'b':r['b'].lower(),'s':r['status'],'why':r['why'],'u':r['src']['url'],'id':r['id']})
    else: alls.append({'m':[x.lower() for x in r['members']],'title':r['title'],'g':r.get('group',''),'q':[{'t':q['t'],'u':q['src']['url']} for q in r['quotes']]})
open(R+'/assets/palio-meta.js','w',encoding='utf-8').write('window.PALIO_META='+json.dumps({'c':nodes,'rel':rels,'all':alls},ensure_ascii=False,separators=(',',':'))+';\n')
print(len(nodes),len(rels),len(alls))
