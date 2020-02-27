<template>
  <div class="jobsummary">
    <div class="header">{{title}}</div>
    <div class="tile">
      <div class="tile r-3">
        <element>
          <span>Total: </span> <br>
          <span class="lighttext">Reference: </span>
        </element>
      </div>
      <div class="tile r-6">
        <element class="text-right">
          <span :class="data.total < data.reference ? 'good' : 'bad'">{{data.total}} {{unit}} <span class="space"/></span><br>
          <span class="lighttext">{{data.reference.toFixed(0)}} {{unit}}</span>
        </element>
      </div>
      <div class="tile r-6">
        <element class="text-right">
          <span :class="data.total < data.reference ? 'good' : 'bad'">{{(data.total / data.reference * 100).toFixed(1)}} % <span class="space"/></span><br>
          <span class="lighttext">{{((1- data.total / data.reference) * 100).toFixed(1)}} % <span class="space"/></span><br>
        </element>
      </div>
      <div class="tile r-6">
        <element class="text-right">
          <span :class="data.total < data.reference ? 'good' : 'bad'">{{(data.total - data.reference).toFixed(1)}} {{unit}} <span class="space"/></span><br>
        </element>
      </div>
    </div>
    <hr class="smallgap">
    <div>Improved tests:</div>
    <svg width="100%" height="45px">
      <StatLine :total="total" :passed="data.improved"/>
    </svg>
    <hr class="smallline">
  </div>
</template>
<script>
import StatLine from "@/components/StatLine.vue";

export default {
  name: 'JobSummaryItem',
  props: {
    title: String,
    data: Object,
    unit: String,
    total: Number
  },
  components: {
    StatLine
  }
}
</script>
<style scoped>
  .text-right {
    text-align: right;
  }
  .lighttext{
    font-weight: 300;
  }

  .good {
    color: rgb(0, 100, 0);
  }
  .bad {
    color: rgb(100, 0, 0);
  }

  .header {
    font-weight: 400;
    font-size: 15pt;
  }

  .r-3 {
    width: 33%;
  }
  .r-6 {
    width: 25.66%;
  }
  .smallgap {
    margin-top: 10px;
    margin-bottom: 0;
  }
  .smallline{
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    border-width: 0.1em;
    border-color: rgba(0, 0, 0, 0.1);
    border-style: solid;
  }
</style>
