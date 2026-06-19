#!/usr/bin/env python3
"""Calculate accurate English content lengths for page group budgets."""
import re

with open('scripts/cv-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

def extract_string_value(t, field):
    """Same regex as check-translation-lengths.py - captures matched quotes properly."""
    pat = re.compile(
        rf'{re.escape(field)}\s*:\s*'
        r"(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1",
        re.DOTALL
    )
    m = pat.search(t)
    return m.group('v') if m else None

def sum_texts_in_array(t, arr_start):
    """Sum all string values in a JSON array."""
    depth, end = 1, arr_start
    while depth > 0 and end < len(t):
        if t[end] == '[':
            depth += 1
        elif t[end] == ']':
            depth -= 1
        end += 1
    content = t[arr_start:end - 1]
    bp = re.compile(r"(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", re.DOTALL)
    return sum(len(m.group('v')) for m in bp.finditer(content))

def get_name_strings_in_array(t, arr_start):
    """Sum only the 'name' field strings in an array of objects."""
    depth, end = 1, arr_start
    while depth > 0 and end < len(t):
        if t[end] == '[':
            depth += 1
        elif t[end] == ']':
            depth -= 1
        end += 1
    content = t[arr_start:end - 1]
    total = 0
    for m in re.finditer(r"name\s*:\s*(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", content):
        total += len(m.group('v'))
    return total

def get_workplace_total(chunk):
    """Total length of description + bullets + project bullets for a workplace."""
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

# Find the CV_DATA object
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

# Education: institution + degree titles
inst = extract_string_value(ct, 'institution')
inst_len = len(inst) if inst else 0

# Find the education object and extract degree titles
edu_match = re.search(r'education\s*:\s*\{', ct)
if edu_match:
    edu_start = edu_match.start()
    edu_depth, edu_end = 1, edu_start + 1
    while edu_depth > 0 and edu_end < len(ct):
        if ct[edu_end] == '{':
            edu_depth += 1
        elif ct[edu_end] == '}':
            edu_depth -= 1
        edu_end += 1
    edu_text = ct[edu_start:edu_end]
    
    # Find degrees array
    deg_match = re.search(r'degrees\s*:\s*\[', edu_text)
    if deg_match:
        deg_start = deg_match.end()
        deg_depth, deg_end = 1, deg_start
        while deg_depth > 0 and deg_end < len(edu_text):
            if edu_text[deg_end] == '[':
                deg_depth += 1
            elif edu_text[deg_end] == ']':
                deg_depth -= 1
            deg_end += 1
        deg_content = edu_text[deg_start:deg_end - 1]
        deg_titles = []
        for dm in re.finditer(r"title\s*:\s*(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", deg_content):
            deg_titles.append(dm.group('v'))

print(f'Education institution: {inst_len} chars')
deg_total = sum(len(t) for t in deg_titles) if 'deg_titles' in dir() and deg_titles else 0
for t in deg_titles if 'deg_titles' in dir() else []:
    print(f'  Degree title: {len(t)} chars - "{t}"')
print(f'Degree titles total: {deg_total} chars')
education_total = inst_len + deg_total
print(f'Education total: {education_total} chars')

# Community
community = extract_string_value(ct, 'community')
community_len = len(community) if community else 0
print(f'Community: {community_len} chars')

# Languages from identity.languages
lang_entry = re.search(r'languages\s*:\s*\[', ct)
languages_len = 0
if lang_entry:
    # Only count name and level, not comment
    lang_start = lang_entry.end()
    ldepth, lend = 1, lang_start
    while ldepth > 0 and lend < len(ct):
        if ct[lend] == '[':
            ldepth += 1
        elif ct[lend] == ']':
            ldepth -= 1
        lend += 1
    lang_content = ct[lang_start:lend - 1]
    for lm in re.finditer(r"(?:name|level)\s*:\s*(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", lang_content):
        languages_len += len(lm.group('v'))
print(f'Languages (name + level): {languages_len} chars')

# programmingLanguages - only name values
pl_entry = re.search(r'programmingLanguages\s*:\s*\[', ct)
pl_names_len = 0
if pl_entry:
    pl_names_len = get_name_strings_in_array(ct, pl_entry.end())
print(f'Programming Languages (name values only): {pl_names_len} chars')

# hobbyProjects - only name values
hp_entry = re.search(r'hobbyProjects\s*:\s*\[', ct)
hp_names_len = 0
if hp_entry:
    hp_names_len = get_name_strings_in_array(ct, hp_entry.end())
print(f'Hobby Projects (name values only): {hp_names_len} chars')

print()
print('=' * 60)
print('PAGE GROUP BUDGETS:')
print('=' * 60)

# Page 1: summary + aegex + telekom
page1 = summary_len + workplaces.get('aegex', 0) + workplaces.get('telekom', 0)
print(f'Page 1 (summary + aegex + telekom): {page1} chars')

# Page 2: scolia + cubicfox + cobotx
page2 = workplaces.get('scolia', 0) + workplaces.get('cubicfox', 0) + workplaces.get('cobotx', 0)
print(f'Page 2 (scolia + cubicfox + cobotx): {page2} chars')

# Page 3: webforsol + education + languages + community + programmingLanguages + hobbyProjects
page3 = workplaces.get('webforsol', 0) + education_total + languages_len + community_len + pl_names_len + hp_names_len
print(f'Page 3 (webforsol + edu + lang + community + proglang + hobby): {page3} chars')
print(f'  webforsol: {workplaces.get("webforsol", 0)}')
print(f'  education: {education_total}')
print(f'  languages: {languages_len}')
print(f'  community: {community_len}')
print(f'  programmingLanguages: {pl_names_len}')
print(f'  hobbyProjects: {hp_names_len}')
