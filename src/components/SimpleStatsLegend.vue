<template>
  <span>
    <svg width="100%" height="35px">
      <g>
        <text x="12" y="15" class="monotext"> &lt;-8% </text>
        <circle cx="5" cy="11" r="4" class="allert"/>
        <text x="72" y="15" class="monotext"> &lt;-3% </text>
        <circle cx="65" cy="11" r="4" class="warning"/>
        <text x="137" y="15" class="monotext"> &lt;+3% </text>
        <circle cx="130" cy="11" r="4" class="neutral"/>
        <text x="202" y="15" class="monotext"> &lt;+8% </text>
        <circle cx="195" cy="11" r="4" class="ok"/>
        <text x="267" y="15" class="monotext"> &gt;+8% </text>
        <circle cx="260" cy="11" r="4" class="good"/>
      </g>
      <g>
        <text x="0" y="33" class="smalltext">0: last job | 0:10: mean last 10 jobs | all: mean all jobs</text>
      </g>
    </svg>
  </span>
</template>
<script>
export default {
  name: 'SimpleStatsLegend',
  props: {},
  methods: {
    get_class: function(num) {
      if (num < -8) {
        return "allert";
      }
      if (num < -4) {
        return "warning";
      }
      if (num > 8) {
        return "good";
      }
      if (num > 4) {
        return "ok";
      }
      return "neutral";
    }
  }
}
</script>
<style>
  .smalltext {
    font-size: 8pt;
    font-family: monospace;
  }
  .monotext {
    fill: #666;
    font-family: monospace;
  }

  .warning {
    fill: orange;
    stroke: orange;
  }

  .allert {
    fill: red;
    stroke: red;
  }

  .neutral {
    fill: yellow;
    stroke: yellow;
  }

  .ok {
    fill: lightgreen;
    stroke: lightgreen;
  }

  .good {
    fill: green;
    stroke: green;
  }
</style>
