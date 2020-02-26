<template>
  <div>
    <b-table
      :paginated="true"
      :data="jobs.jobs"
      :columns="columns"
      :row-class="(row, index) => row.result.tag"
      @click="rowClicked"
    >
    </b-table>
    <!-- <table>
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
      <tr v-for="(job, index) in jobs.jobs" :key="index" :class="[job.result.tag == 'SUCCESS' ? 'passed' : 'failed' ]">
        <td><router-link :to="`/job/${job.ID}`">{{ job.ID }}</router-link></td>
        <td> {{ job.jobnum }} </td>
        <td> {{ job.dockerTag.name }} </td>
        <td> {{ job.testScope }} </td>
        <td> {{ job.timestamp_start }} </td>
        <td> {{ duration(job) }} </td>
        <td> {{ job.result.tag }} </td>
      </tr>
    </table> -->
  </div>
</template>
<script>
import router from '../router'

const format = require('string-format');

function i2s(num) {
  if (num < 10)
    return "0"+num;
  return num;
}

export default {
  name: 'Overview',
  data() {
    return {
      columns: [
        {
          field: 'ID',
          label: 'ID',
          numeric: true,
          sortable: true
        },
        {
          field: 'jobnum',
          label: 'Job Number',
          numeric: true,
          sortable: true
        },
        {
          field: 'dockerTag.name',
          label: 'Branch',
          centered: true,
          sortable: true
        },
        {
          field: 'timestamp_start',
          label: 'Time stamp',
          centered: true,
          sortable: true
        },
        {
          field: 'result.tag',
          label: 'Result',
          centered: true,
          sortable: true
        }
      ]
    }
  },
  props: {
    jobs: Object
  },
  methods: {
    duration(job) {
      var end = new Date(job.timestamp_end);
      var start = new Date(job.timestamp_start);
      console.log(end.getTime())
      var diff = end.getTime() - start.getTime();
      var hour = Math.floor(diff / 3.6e6);
      var min = Math.round(diff / 6e4)  - hour * 60;
      return format("{0}h{1}m", hour, i2s(min));
    },
    rowClicked(record) {
      router.push("/job/"+record["ID"]);
    }
  }
}
</script>
<style>


.SUCCESS {
  background-color: rgba(125, 255, 125, 0.2);
}
.FAILED {
  background-color: rgba(255, 125, 125, 0.2);
}
</style>
