#!/usr/bin/env python3
import re

with open('scripts/cv-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

def extract_string_value(t, field):
    pat = re.compile(
        rf'{re.escape(field)}\s*:\s*'
        r'(?P<q>[\"\'])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1',
        re.DOTALL
    )
    m = pat.search(t)
    return m.group('v') if m else None

def sum_texts_in_array(t, arr_start):
    depth, end = 1, arr_start
    while depth > 0 and end < len(t):
        if t[end] == '[':
            depth += 1
        elif t[end] == ']':
            depth -= 1
        end += 1
    content = t[arr_start:end - 1]
    bp = re.compile(r'(?P<q>[\"\'])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1', re.DOTALL)
    return sum(len(m.group('v')) for m in bp.finditer(content))

def get_workplace_total(chunk):
    total = 0
    d = extract_string_value(chunk, 'description')
    if d:
        total += len(d)
    bm = re.search(r'bullets\s*:\s*\[', chunk)
    if bm:
        total += sum_texts_in_array(chunk, bm.end())
    pm = re.search(r'projects\s*:\s*\[', chunk)
    if pm:
        pstart = pm.end()
        pdepth, pend = 1, pstart
        while pdepth > 0 and pend < len(chunk):
            if chunk[pend] == '[':
                pdepth += 1
            elif chunk[pend] == ']':
                pdepth -= 1
            pend += 1
        pt = chunk[pstart:pend - 1]
        for pbm in re.finditer(r'bullets\s*:\s*\[', pt):
            total += sum_texts_in_array(pt, pbm.end())
    return total

# Find the main CV_DATA object
cm = re.search(r'export const CV_DATA = \{', text)
cstart = cm.end()
depth, cend = 1, cstart
while depth > 0 and cend < len(text):
    if text[cend] == '{':
        depth += 1
    elif text[cend] == '}':
        depth -= 1
    cend += 1
ct = text[cstart:cend - 1]

# Summary
summary = extract_string_value(ct, 'summary')
summary_len = len(summary) if summary else 0
print(f'Summary: {summary_len} chars')

# Workplaces
workplaces = {}
for idm in re.finditer(r'id:\s*[\"\'](\w+)[\"\']', ct):
    wid = idm.group(1)
    pos = idm.start()
    bef = ct[max(0, pos - 200):pos]
    if 'projects' in bef and 'description' not in bef:
        continue
    chunk = ct[pos:pos + 3000]
    total = get_workplace_total(chunk)
    workplaces[wid] = total
    print(f'{wid}: {total} chars')

# Education
inst = extract_string_value(ct, 'institution')
inst_len = len(inst) if inst else 0
edu_chunk_search = re.search(r'education\s*:\s*\{', ct)
edu_chunk = ct[edu_chunk_search.start():edu_chunk_search.start() + 2000] if edu_chunk_search else ct
degree_titles = []
for dm in re.finditer(r'title:\s*[\"\'](.*?)[\"\']', edu_chunk):
    degree_titles.append(dm.group(1))
edu_total = inst_len + sum(len(t) for t in degree_titles)
print(f'Education institution: {inst_len} chars')
for t in degree_titles:
    print(f'  Degree title: {len(t)} chars - "{t}"')
print(f'Education total: {edu_total} chars')

# Community
community = extract_string_value(ct, 'community')
community_len = len(community) if community else 0
print(f'Community: {community_len} chars')

# Languages from identity.languages
lang_entry = re.search(r'languages\s*:\s*\[', ct)
lang_total = 0
if lang_entry:
    lang_total = sum_texts_in_array(ct, lang_entry.end())
print(f'Languages (all name+level strings): {lang_total} chars')

# programmingLanguages
pl_entry = re.search(r'programmingLanguages\s*:\s*\[', ct)
pl_total = 0
if pl_entry:
    pl_total = sum_texts_in_array(ct, pl_entry.end())
print(f'Programming Languages (all name strings): {pl_total} chars')

# hobbyProjects
hp_entry = re.search(r'hobbyProjects\s*:\s*\[', ct)
hp_total = 0
if hp_entry:
    hp_total = sum_texts_in_array(ct, hp_entry.end())
print(f'Hobby Projects (all name strings): {hp_total} chars')

print()
print('=' * 50)
print('PAGE GROUP TOTALS:')
print('=' * 50)

# Page 1: summary + aegex + telekom
page1 = summary_len + workplaces.get('aegex', 0) + workplaces.get('telekom', 0)
print(f'Page 1 (summary + aegex + telekom): {page1} chars')

# Page 2: scolia + cubicfox + cobotx
page2 = workplaces.get('scolia', 0) + workplaces.get('cubicfox', 0) + workplaces.get('cobotx', 0)
print(f'Page 2 (scolia + cubicfox + cobotx): {page2} chars')

# Page 3: webforsol + education + languages + community + programmingLanguages + hobbyProjects
page3 = workplaces.get('webforsol', 0) + edu_total + lang_total + community_len + pl_total + hp_total
print(f'Page 3 (webforsol + edu + lang + community + proglang + hobby): {page3} chars')
print(f'  webforsol: {workplaces.get("webforsol", 0)}')
print(f'  education: {edu_total}')
print(f'  languages: {lang_total}')
print(f'  community: {community_len}')
print(f'  programmingLanguages: {pl_total}')
print(f'  hobbyProjects: {hp_total}')
