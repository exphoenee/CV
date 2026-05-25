import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('e:/Projects/CV/cv-game.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the pause-menu section
for i, line in enumerate(lines):
    if 'pause-menu' in line and 'id=' in line:
        print(f"=== pause-menu starts at L{i+1} ===")
        # Print from here to the closing of the pause-menu div
        # Find the right closing div
        depth = 0
        started = False
        for j in range(i, min(i+80, len(lines))):
            stripped = lines[j].strip()
            if 'id="pause-menu"' in stripped or 'class="dialogue' in stripped:
                started = True
            if started:
                print(f"L{j+1}: {lines[j]}", end='')
                # Count divs
                open_divs = stripped.count('<div') - stripped.count('</div>')
                depth += open_divs
                if depth == 0 and started and j > i:
                    break
        break

# Also check the M key handler in main.js
print("\n\n=== M key handler in main.js ===")
with open('e:/Projects/CV/scripts/game/main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'M to toggle' in line:
        # Print from here to the closing of the keydown event listener
        for j in range(i, min(i+30, len(lines))):
            print(f"L{j+1}: {lines[j]}", end='')
        break
