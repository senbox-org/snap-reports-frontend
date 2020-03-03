<template>
  <section :id="test">
    <b-field grouped group-multiline>
      <b-field label="Branch">
        <b-select v-model="sel" @input="update">
          <option v-for="branch in branches" :key="branch" :value="branch">{{branch}}</option>
        </b-select>
      </b-field>
      <b-field label="Field"  >
        <b-select v-model="field" @input="update">
          <option value="duration">Duration</option>
          <option value="cpu_time">CPU time</option>
          <option value="memory_avg">Memory</option>
          <option value="io_read">IO Read</option>
        </b-select>
      </b-field>
      <b-field label="Mode">
        <b-select v-model="mode"  @input="update">
          <option value="1">No average</option>
          <option value="5">Moving average 5</option>
          <option value="10">Moving average 10</option>
        </b-select>
      </b-field>

    </b-field>

    <Plotly v-if="history != undefined" :data="history_plot()" :layout="layout()"  :display-mode-bar="false"/>

  </section>
</template>
<script>
import { Plotly } from 'vue-plotly'

import api from '@/assets/api.js';
const axios = require('axios').default;

export default {
  name: 'TestHistory',
  props: ['test'],
  mounted() {
    axios
      .get(api.call('api/branch/list'))
      .then((res) => (this.branches = this.branches.concat(res.data.branches.map(x => x.name.split(':')[1]))));
    axios
      .get(api.call('api/test', this.test, 'moving_average', this.field, 'any', this.mode))
      .then((res) => (this.history = res.data));
    axios
      .get(api.call('api/test', this.test, 'reference'))
      .then((res) => (this.reference = res.data))
  },
  data() {
    return {
      branches: ["any"],
      sel : "any",
      mode: 5,
      field: 'cpu_time',
      history: undefined,
      reference: undefined,
      title: {
        cpu_time: "CPU Time",
        memory_avg: "Memory",
        duration: "Duration",
        io_read: "IO Read"
      },
      unit: {
        cpu_time: "time (s)",
        memory_avg: "memory (Mb)",
        duration: "time (s)",
        io_read: "count (#)"
      }
    }
  },
  methods: {
    update(){
      if (this.sel == '*')
        axios
          .get(api.call('api/test', this.test, 'moving_average', this.field, 'any', this.mode))
          .then((res) => (this.history = res.data));
      else
        axios
          .get(api.call('api/test', this.test, 'moving_average', this.field, this.sel, this.mode))
          .then((res) => (this.history = res.data));
    },
    history_plot() {
      if (this.history == undefined || this.history.date.length == 0)
        return [];


      var res = [
      {
        name: 'history',
        x: this.history.date,
        y: this.history.value
      }]
      if (this.reference != null) {
        let start = this.history.date[0];
        let end = this.history.date[this.history.date.length-1];
        let val = this.reference[this.field];
        res.push({
          x: [start, end],
          y: [val, val],
          name: 'reference'
        })
      }
      return res;
    },
    layout() {
      return {
        title: this.title[this.field],
        yaxis: {
          title:this.unit[this.field]
        },
        xaxis: {
          title:'Date'
        }
      }
    }
  },
  components: {
    Plotly
  }
}
</script>
