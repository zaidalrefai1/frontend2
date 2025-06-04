---
layout: default
title: Vaccine Volcano
scripts:
  - /assets/game/vaccine_volcano.js
---

<canvas id="vaccineVolcanoCanvas" width="800" height="600"></canvas>

<p>
    <button id="backToHubButton">Back to Hub</button>
    <button id="submitButton">Submit</button>
</p>

<script type="module" src="{{ '/assets/game/vaccine_volcano.js' | relative_url }}"></script>