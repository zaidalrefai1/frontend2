---
layout: default
title: Biogame - Start
scripts:
  - /assets/game/start.js # Ensure this links to your start.js
---

<div class="start-page-content">
    <h1>Welcome to Biogame!</h1>
    <p>Embark on an epic adventure through the microscopic world.</p>
    <p>Use WASD or Arrow Keys to move your character.</p>
    <button id="startGameButton">Start Game</button>
</div>

<script type="module" src="{{ '/assets/game/start.js' | relative_url }}"></script>