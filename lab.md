---
layout: default
title: DNA Lab
scripts:
  - /assets/game/lab.js
---

<canvas id="labCanvas" width="800" height="600"></canvas>

<p>
    <button id="backToHubButton">Back to Hub</button>
    <button id="submitButton">Submit</button> <!-- NEW SUBMIT BUTTON -->
</p>

<script type="module" src="{{ '/assets/game/lab.js' | relative_url }}"></script>