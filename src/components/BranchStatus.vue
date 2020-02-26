<template>
  <svg width="100%" height="75px" class="branch-status">
    <g>
      <!-- <text x="40%" y="10">Last</text>
      <text x="60%" y="10">Last 10</text>
      <text x="80%" y="10">Average</text> -->

      <text x="5" y="25">CPU Time</text>
      <text x="5" y="40">Memory</text>
      <text x="5" y="55">IO Read</text>

      <circle cx="100" cy="20" r="4"/>
      <circle cx="120" cy="20" r="4"/>
      <circle cx="140" cy="20" r="4"/>

      <circle cx="100" cy="35" r="4"/>
      <circle cx="120" cy="35" r="4"/>
      <circle cx="140" cy="35" r="4"/>

      <circle cx="100" cy="50" r="4"/>
      <circle cx="120" cy="50" r="4"/>
      <circle cx="140" cy="50" r="4"/>
    </g>
  </svg>
</template>
<style>
  .branch-status text {
    fill: #000;
    font-size: 10pt;
  }

  circle {
    stroke: #000;
    fill: #000;
  }
</style>
