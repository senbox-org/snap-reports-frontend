<template>
  <span class="simplestats">
    <svg width="132" height="80" viewbox="0 0 132 40">

      <text x="0" y="0" class="tinytext" transform="translate(78 19) rotate(60 0,0)">0</text>
      <text x="0" y="0" class="tinytext" transform="translate(90 3) rotate(60 0,0)">0:10</text>
      <text x="0" y="0" class="tinytext" transform="translate(113 8) rotate(60 0,0)">all</text>

      <text x="1" y="35" class="bigtext"> {{ tag }} </text>
      <circle cx="86" cy="30" r="4" :class="get_class(data.last)"/>
      <circle cx="106" cy="30" r="4" :class="get_class(data.last10)"/>
      <circle cx="126" cy="30" r="4" :class="get_class(data.average)"/>
      <g transform="translate(0 40)">
        <StatLine :total="total" :passed="improved"/>
      </g>
    </svg>
  </span>
</template>
<script>
import StatLine from "@/components/StatLine.vue"

export default {
  name: 'SimpleStatsView',
  props: {
    tag: String,
    data: Object,
    improved: Number,
    total: Number
  },
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
  },
  components: {
    StatLine
  }
}
</script>
<style>
  .tinytext {
    fill: #333;
    font-size: 7pt;
    font-family: monospace;
  }

  .simplestats {
    margin-right: 25px;
  }

  .bigtext {
    fill: #000;
    font-size: 10pt;
  }

  .warning {
    fill: orange;
    stroke: darkgray;
  }

  .allert {
    fill: red;
    stroke: darkgray;
  }

  .neutral {
    fill: yellow;
    stroke: darkgray;
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
