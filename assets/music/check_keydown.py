import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('e:/Projects/CV/scripts/game/main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Print the full keydown handler
in_handler = False
for i, line in enumerate(lines):
    if 'setupKeyboardListeners' in line:
        in_handler = True
    if in_handler:
        print(f"L{i+1}: {line}", end='')
    if in_handler and line.strip() == '});' and i > 0 and lines[i-1].strip() == '});':
        break
    if in_handler and i > 400:
        break
