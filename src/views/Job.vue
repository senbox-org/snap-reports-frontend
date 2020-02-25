<template>
  <div>
    <h3>Job {{job.jobnum}} ({{job.ID}})</h3>
    <h4>Branch: {{job.dockerTag.name}}</h4>
    <h4>Started: {{job.timestamp_start}}</h4>
    <h4>Ended: {{job.timestamp_end}}</h4>
    <h4>Duration: {{summary.duration}} s</h4>
    <h4>CPU time: {{summary.cpu_time}} s - Average CPU usage: {{Math.round(summary.cpu_time / summary.duration * 100)}} %</h4>
    <h4>Tests executed: {{summary.num_tests}}</h4>
    <h4>Passed: {{summary.passed}}</h4>
    <h4>Failed: {{summary.failed}}</h4>
    <li v-for="(test, index) in summary.tests" :key="index">{{test}}
    </li>
  </div>
</template>

<script>
const axios = require('axios').default;

export default {
  name: 'job',
  data() {
    return {
      id: this.$route.fullPath,
      job: undefined,
      summary: undefined
    }
  },
  mounted() {
    axios
      .get("http://localhost:9090/api"+this.id)
      .then(res =>(this.job = res.data));
    axios
      .get("http://localhost:9090/api"+this.id+"/summary")
      .then(res =>(this.summary = res.data))
  }
}

</script>
<style scoped>
</style>
