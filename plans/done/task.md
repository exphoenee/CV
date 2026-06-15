# Task Checklist: 2.5D Custom Canvas Game CV View

## Phase 1: Planning & Setup

- [x] Create the comprehensive implementation plan inside `devdocs/implementation_plan.md`
- [x] Structure the task list in `devdocs/task.md`
- [x] Scan and verify the Cute sprite assets dimensions and layout using a secure script

## Phase 2: Base Game Architecture

- [x] Create `e:\Projects\CV\scripts\game\GameObject.js` (Base class for all elements)
- [x] Create `e:\Projects\CV\scripts\game\map.js` (Tile definitions, coordinates, building layouts)

## Phase 3: Entity Classes (Inheriting from GameObject)

- [x] Create `e:\Projects\CV\scripts\game\Player.js` (WASD movement, Space attack, spritesheet parsing)
- [x] Create `e:\Projects\CV\scripts\game\Npc.js` (Base NPC wander logic)
- [x] Create `e:\Projects\CV\scripts\game\Chicken.js` (Passive Chicken animal)
- [x] Create `e:\Projects\CV\scripts\game\Cow.js` (Passive Cow animal)
- [x] Create `e:\Projects\CV\scripts\game\Pig.js` (Passive Pig animal)
- [x] Create `e:\Projects\CV\scripts\game\Sheep.js` (Passive Sheep animal)
- [x] Create `e:\Projects\CV\scripts\game\Skeleton.js` (Aggro Skeleton enemy, 3 lives, chaser)

## Phase 4: Passive Obstacles & Buildings

- [x] Create `e:\Projects\CV\scripts\game\Tree.js` (Collidable tree)
- [x] Create `e:\Projects\CV\scripts\game\Fence.js` (Boundary collision fences)
- [x] Create `e:\Projects\CV\scripts\game\Chest.js` (Treasure decoration/chest)
- [x] Create `e:\Projects\CV\scripts\game\House.js` (CV Station house, triggers freeze dialogue)

## Phase 5: Canvas Engine & Main Game Loop

- [x] Create `e:\Projects\CV\scripts\game\main.js` (Game loop, camera tracking, y-sorting depth manager, input handlers)
- [x] Establish pixelated rendering scaling and camera bounds
- [x] Implement AABB rectangle collisions between active entities and passive obstacles

## Phase 6: HTML & CSS Overlay UI

- [x] Create `e:\Projects\CV\cv-game.html` with canvas containers and credits link to Kenmi-art
- [x] Structure the retro dialogue popup box with 3 scroll-buttons (Up, Down, Exit)
- [x] Create `e:\Projects\CV\styles\cv-game.css` for canvas positioning, scanline/CRT screens, and retro glassmorphic dialogues
- [x] Wire up the scroll button logic in `main.js` to scroll the inner text and freeze/unfreeze game updates

## Phase 7: Landing Page Integration

- [x] Add the 4th option button "I'm a Gamer" in `index.html`
- [x] Add the custom hover states and CSS rules for `.btn-game` inside `styles/cv-index.css`

## Phase 8: Verification & Polish

- [x] Manually test character movements and boundaries
- [x] Test NPC random wander movements
- [x] Verify Skeletons pursue player when in range and take 3 hits to die
- [x] Validate House door triggers pause, populates CV details, and handles Scroll Up/Down/Exit buttons
- [x] Check responsive UI and CRT graphics on multiple resolutions
