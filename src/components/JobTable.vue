<template>
  <div>
    <table>
      <thead>
        <tr>
          <th> ID </th>
          <th> Job Number </th>
          <th> Branch </th>
          <th> Tag </th>
          <th> Time stamp </th>
          <th> Duration </th>
          <th> Result </th>
        </tr>
      </thead>
      <tr v-for="(job, index) in jobs.data.jobs" :key="index" :class="[job.result.tag == 'SUCCESS' ? 'passed' : 'failed' ]">
        <td><router-link :to="`/job/${job.ID}`">{{ job.ID }}</router-link></td>
        <td> {{ job.jobnum }} </td>
        <td> {{ job.dockerTag.name }} </td>
        <td> {{ job.testScope }} </td>
        <td> {{ job.timestamp_start }} </td>
        <td> {{ duration(job) }} </td>
        <td> {{ job.result.tag }} </td>
      </tr>
    </table>
  </div>
</template>
<script>
const format = require('string-format');

function i2s(num) {
  if (num < 10)
    return "0"+num;
  return num;
}

export default {
  name: 'Overview',
  props: {
    jobs: Object
  },
  methods: {
    duration: function(job) {
      var end = new Date(job.timestamp_end);
      var start = new Date(job.timestamp_start);
      console.log(end.getTime())
      var diff = end.getTime() - start.getTime();
      var hour = Math.floor(diff / 3.6e6);
      var min = Math.round(diff / 6e4)  - hour * 60;
      return format("{0}h{1}m", hour, i2s(min));
  }
}
}
</script>
<style>

table {
  border: 2px solid #42a0b9;
  border-radius: 3px;
  background-color: #fff;
  width: 100%;
}

th {
  background-color: #42a0b9;
  color: rgba(255,255,255,1);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

th, td {
  padding: 10px 20px;
}

.passed {
  background-color: rgba(125, 255, 125, 0.5);
}
.failed {
  background-color: rgba(255, 125, 125, 0.3);
}
</style>
