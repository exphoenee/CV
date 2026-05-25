import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('e:/Projects/CV/scripts/game/main.js', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

# Find togglePauseMenu
for i, line in enumerate(lines):
    if 'togglePauseMenu()' in line and ('{'):
        # Print from this line to closing }
        depth = 0
        started = False
        for j in range(i, min(i+30, len(lines))):
            print(f"L{j+1}: {lines[j]}")
            if '{' in lines[j]:
                started = True
                depth += lines[j].count('{') - lines[j].count('}')
            elif started:
                depth += lines[j].count('{') - lines[j].count('}')
            if started and depth <= 0:
                break
        print()

# Find pauseGame
for i, line in enumerate(lines):
    if 'pauseGame()' in line and '{' in line and i > 430:
        depth = 0
        started = False
        for j in range(i, min(i+20, len(lines))):
            print(f"L{j+1}: {lines[j]}")
            if '{' in lines[j]:
                started = True
                depth += lines[j].count('{') - lines[j].count('}')
            elif started:
                depth += lines[j].count('{') - lines[j].count('}')
            if started and depth <= 0:
                break
        print()

# Find resumeGame
for i, line in enumerate(lines):
    if 'resumeGame()' in line and '{' in line and i > 440:
        depth = 0
        started = False
        for j in range(i, min(i+20, len(lines))):
            print(f"L{j+1}: {lines[j]}")
            if '{' in lines[j]:
                started = True
                depth += lines[j].count('{') - lines[j].count('}')
            elif started:
                depth += lines[j].count('{') - lines[j].count('}')
            if started and depth <= 0:
                break
        print()
