<template>
  <section :id="test">
    <b-field grouped group-multiline>
      <b-field label="Branch">
        <b-select v-model="sel" @input="update">
          <option v-for="branch in branches" :key="branch" :value="branch">{{branch}}</option>
        </b-select>
      </b-field>
    </b-field>
    <div v-if="summary != undefined">
      <Info tag="Number of executions" :value="summary.executions"/>
      <div v-if="summary.executions > 0">
        <svg width="35%" height="50px">
          <StatLine :passed="summary.results.passed" :total="summary.executions"/>
        </svg>
        <Info tag="Average duration" :value="summary.duration.average.toFixed(1)" unit='s'/>
        <Info tag="Average CPU time" :value="summary.cpu_time.average.toFixed(1)" unit='s'/>
        <Info tag="Average memory usage" :value="summary.memory_avg.average.toFixed(1)" unit='Mb'/>
        <Info tag="Average IO Read" :value="summary.io_read.average.toFixed(1)" />
      </div>
    </div>
  </section>
</template>
<script>
import api from '@/assets/api.js';
import StatLine from '@/components/StatLine.vue';
import Info from '@/components/Info.vue';
const axios = require('axios').default;

export default {
  name: 'TestOverview',
  props: ['test'],
  data() {
    return {
      branches: ["any"],
      sel : "any",
      summary: undefined,
    }
  },
  mounted() {
    axios
      .get(api.call('api/branch/list'))
      .then((res) => (this.branches = this.branches.concat(res.data.branches.map(x => x.name.split(':')[1]))));
    axios
      .get(api.call('api/test', this.test, 'summary'))
      .then((res) => (this.summary = res.data));
  },
  methods: {
    update(){
      if (this.sel == 'any')
        axios
          .get(api.call('api/test', this.test, 'summary'))
          .then((res) => (this.summary = res.data));
      else
        axios
          .get(api.call('api/test', this.test, 'summary', this.sel))
          .then((res) => (this.summary = res.data));
    }
  },
  components: {
    StatLine,
    Info
  }
}
</script>
