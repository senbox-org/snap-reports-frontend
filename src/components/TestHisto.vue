<template>
  <section :id="test">
    <b-field grouped group-multiline>
      <b-field label="Branch">
        <b-select v-model="sel" @input="update">
          <option v-for="branch in branches" :key="branch" :value="branch">{{branch}}</option>
        </b-select>
      </b-field>
      <b-field label="Mode">
        <b-select v-model="mode">
          <option value="val">Value</option>
          <option v-if="reference != null" value="abs">Improvements (Abs)</option>
          <option v-if="reference != null" value="rel">Improvements (Rel)</option>
        </b-select>
      </b-field>
    </b-field>
    <br>
    <div v-for="field in histos" :key="field" class="hw">
      <Plotly :data="hist(field, mode)" :layout="layout(field, mode)"  :display-mode-bar="false"/>
    </div>

  </section>
</template>
<script>
import { Plotly } from 'vue-plotly'

import api from '@/assets/api.js';
const axios = require('axios').default;

export default {
  name: 'TestHisto',
  props: ['test'],
  data() {
    return {
      branches: ["any"],
      sel : "any",
      mode: 'val',
      cpu_time: undefined,
      duration: undefined,
      memory_avg: undefined,
      io_read: undefined,
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
      },
      histos: [
        'duration',
        'cpu_time',
        'memory_avg',
        'io_read'
      ]
    }
  },
  mounted() {
    axios
      .get(api.call('api/branch/list'))
      .then((res) => (this.branches = this.branches.concat(res.data.branches.map(x => x.name.split(':')[1]))));
    axios
      .get(api.call('api/test', this.test, 'history/cpu_time/any'))
      .then((res) => (this.cpu_time = res.data.value));
    axios
      .get(api.call('api/test', this.test, 'history/duration/any'))
      .then((res) => (this.duration = res.data.value));
    axios
      .get(api.call('api/test', this.test, 'history/memory_avg/any'))
      .then((res) => (this.memory_avg = res.data.value));
    axios
      .get(api.call('api/test', this.test, 'history/io_read/any'))
      .then((res) => (this.io_read = res.data.value));
    axios
      .get(api.call('api/test', this.test, 'reference'))
      .then((res) => (this.reference = res.data))
  },

  methods: {
    update(){
      axios
        .get(api.call('api/test', this.test, 'history/cpu_time', this.sel))
        .then((res) => (this.cpu_time = res.data.value));
      axios
        .get(api.call('api/test', this.test, 'history/duration', this.sel))
        .then((res) => (this.duration = res.data.value));
      axios
        .get(api.call('api/test', this.test, 'history/memory_avg', this.sel))
        .then((res) => (this.memory_avg = res.data.value));
      axios
        .get(api.call('api/test', this.test, 'history/io_read', this.sel))
        .then((res) => (this.io_read = res.data.value));
    },
    hist(field, mode) {
      if (this[field] == undefined) {
        return []
      }
      var xs = []
      if (mode == 'abs') {
        xs = this[field].map(x => (x - this.reference[field]))
      } else if (mode == 'rel') {
        xs = this[field].map(x => ((-100* (x - this.reference[field]) / this.reference[field])))
      } else {
        xs = this[field];
      }
      return [
        {
          type: 'histogram',
          x: xs,
        }
      ]
    },
    layout(field, mode) {
      return {
        yaxis: {
          title: '# executions'
        },
        xaxis: {
          title: this.get_unit(field, mode)
        },
        title: this.title[field]
      }
    },
    get_unit(field, mode) {
      if (mode == 'rel')
        return "Improvement (%)<br>Bigger the better";
      return this.unit[field]+'<br>Smaller the better';
    }
  },
  components: {
    Plotly
  }
}
</script>
