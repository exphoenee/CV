import sys
sys.stdout.reconfigure(encoding='utf-8')

# Check start screen in HTML
with open('e:/Projects/CV/cv-game.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('start-screen')
if idx >= 0:
    line = html[:idx].count('\n') + 1
    print(f"L{line}: {html[max(0,idx-80):min(len(html),idx+120)]}")

# Check the startGame function in main.js
with open('e:/Projects/CV/scripts/game/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('startGame')
if idx >= 0:
    # Find the function
    start_func = content.rfind('\n', 0, idx)
    end_func = content.find('\n\n', idx)
    print(f"\n=== startGame function ===")
    print(content[max(0,start_func):min(len(content),end_func+200)])

# Check if there's an issue - does the start screen remain visible?
# Look for "start-screen" class usage in JS
print("\n=== Start screen class references in JS ===")
for term in ['start-screen', 'startScreen']:
    idx = 0
    while True:
        idx = content.find(term, idx)
        if idx < 0:
            break
        line_num = content[:idx].count('\n') + 1
        print(f"L{line_num}: {content[max(0,idx-30):min(len(content),idx+80)]}")
        idx += 1

# Check what happens with isFrozen in togglePauseMenu and pauseGame
print("\n=== Pause-related functions ===")
for term in ['togglePauseMenu', 'pauseGame()', 'resumeGame()']:
    idx = 0
    while True:
        idx = content.find(term, idx)
        if idx < 0:
            break
        line_num = content[:idx].count('\n') + 1
        print(f"L{line_num}: {content[max(0,idx-10):min(len(content),idx+150)]}")
        idx += 1
