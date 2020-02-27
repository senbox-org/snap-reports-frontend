<template>
  <g>
    <rect x="0" y="5" :width="passed_perc()" height="20" class="success"/>
    <rect :x="passed_perc()" y="5" :width="failed_perc()" height="20" class="failed"/>
    <text  v-if="passed > 0" x="1%" y="19" class="inner">{{passed}}</text>
    <text v-if="(total - passed) > 0" x="99%" y="19" class="inner" text-anchor="end">{{total - passed}}</text>
    <text x="0" y="40">Total: {{total}}</text>
  </g>
</template>
<script>
export default {
  name: 'StatLine',
  props:{
    total: Number,
    passed: Number,
  },
  methods: {
    passed_perc: function() {
      return Math.round(this.passed/this.total * 100)+"%";
    },
    failed_perc: function() {
      return (100 - Math.round(this.passed/this.total * 100)) + "%";
    },
    failednum_pos: function() {
      return Math.round(this.passed/this.total * 100 + 1)+"%";
    }
  }
}
</script>
<style>
polygon {
  fill: #42b983;
  opacity: 0.75;
}

circle {
  fill: transparent;
  stroke: #999;
}

text {
  font-family: Helvetica Neue, Arial, sans-serif;
  font-size: 12px;
  fill: #666;
}

label {
  display: inline-block;
  margin-left: 10px;
  width: 20px;
}
.success {
  fill: rgb(44, 143, 44);
}

.failed {
  fill: rgb(205, 92, 92);
}
.inner {
  fill: #fff;
}
</style>
