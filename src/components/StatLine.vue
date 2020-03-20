<template>
  <g>
    <rect x="0" y="5" :width="passed_perc()" height="20" class="success"/>
    <rect :x="passed_perc()" y="5" :width="warning_perc()" height="20" class="none"/>
    <rect :x="failed_begin()" y="5" :width="failed_perc()" height="20" class="failed"/>
    <text v-if="passed > 0" x="1%" y="19" class="inner">{{passed}}</text>
    <text v-if="warning > 0" :x="warn_pos()" y="19" class="inner">{{warning}}</text>
    <text v-if="failed()> 0" x="99%" y="19" class="inner" text-anchor="end">{{failed()}}</text>
    <text x="0" y="40">Total: {{total}}</text>
  </g>
</template>
<script>
export default {
  name: 'StatLine',
  props:{
    total: Number,
    passed: Number,
    warning: Number
  },
  methods: {
    passed_perc() {
      return Math.round(this.passed/this.total * 100)+"%";
    },
    failed_perc() {
      return Math.round(this.failed()/this.total * 100) +"%"
    },
    failed_begin() {
      return Math.floor((this.total-this.failed())/this.total * 100) + "%";
    },
    warning_perc() {
      if (this.warning == undefined)
        return 0;
      return Math.round(this.warning/this.total *100) + '%';
    },
    warn_pos() {
      if (this.passed + this.warning == this.total) {
        return "99%";
      }
      var x =this.passed + this.warning / 2;
      return Math.round(x/this.total * 100) + "%";
    },
    failed() {
      var num = this.total - this.passed;
      if (this.warning != undefined)
        num -= this.warning;
      return num;
    }
  }
};
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
.none {
  fill: #999;
}
.inner {
  fill: #fff;
}
</style>
