import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('e:/Projects/CV/cv-game.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find pause-menu to check it exists
idx = html.find('id="pause-menu"')
if idx >= 0:
    line = html[:idx].count('\n') + 1
    print(f"✅ pause-menu found at L{line}")
    print(html[max(0,idx-50):min(len(html),idx+100)])
else:
    idx = html.find("pause-menu")
    if idx >= 0:
        line = html[:idx].count('\n') + 1
        print(f"⚠️  pause-menu referenced at L{line} but not with id=\\\"pause-menu\\\"")
        print(html[max(0,idx-20):min(len(html),idx+80)])
    else:
        print("❌ pause-menu NOT FOUND in HTML!")

# Check JS togglePauseMenu, pauseGame, resumeGame
with open('e:/Projects/CV/scripts/game/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Check dialogue-visible/hidden usage
for term in ['togglePauseMenu', 'pauseGame', 'resumeGame']:
    idx = js.find(term)
    if idx >= 0:
        line = js[:idx].count('\n') + 1
        print(f"\n✅ {term}() found at L{line}")

# Show the full togglePauseMenu function
print("\n=== togglePauseMenu ===")
idx = js.find('togglePauseMenu()')
if idx >= 0:
    start = js.rfind('\n', 0, idx)
    end = js.find('\n\n', idx + 20)
    print(js[start:end])

# Show pauseGame
print("\n=== pauseGame ===")
idx = js.find('pauseGame()')
if idx >= 0:
    start = js.rfind('\n', 0, idx)
    end = js.find('\n\n', idx + 20)
    print(js[start:end])

# Show resumeGame
print("\n=== resumeGame ===")
idx = js.find('resumeGame()')
if idx >= 0:
    start = js.rfind('\n', 0, idx)
    end = js.find('\n\n', idx + 20)
    print(js[start:end])
