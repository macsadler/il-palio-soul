#!/usr/bin/env python3
import os,re,sys,collections
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
miss=collections.Counter();ex={}
for root,_,fs in os.walk(R):
    if '/.git' in root: continue
    for f in fs:
        if not f.endswith('.html'): continue
        p=os.path.join(root,f); s=open(p,encoding='utf-8').read()
        for h in re.findall(r'(?:href|src)="([^"#?]+)',s):
            if re.match(r'(https?:|mailto:|data:|javascript:)',h): continue
            t=os.path.normpath(os.path.join(root,h))
            if not os.path.exists(t): 
                k=os.path.relpath(t,R).split('/')[0:2]; miss['/'.join(k)]+=1; ex.setdefault('/'.join(k),(os.path.relpath(p,R),h))
print(sum(miss.values()),'broken'); 
for k,v in miss.most_common(25): print(v,k,ex[k])
