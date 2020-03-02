<template>
  <div class="notification">
    <article>
      <p class="subtitle">branch</p>
      <p class="title">{{id}}</p>

      <b-tabs card>
        <b-tab-item label="Last Job">
          <b> Job (<router-link :to="'/job/'+last_job.ID">#{{last_job.ID}}</router-link>)</b><br>
          <span class="lighttext">Job number:</span> {{last_job.jobnum}}<br>
          <span class="lighttext">Executed:</span> {{last_job.timestamp_start}}<br>
          <span class="lighttext">Test scope:</span> {{last_job.testScope}}<br>
          <span class="lighttext">Result:</span> <span :class="last_job.tag">{{last_job.tag}}</span><br>
        </b-tab-item>
        <b-tab-item label="Branch details">
          <BranchTable :data="details"/>
        </b-tab-item>
      </b-tabs>
    </article>
  </div>
</template>
<script>
  const axios = require('axios').default;

  import api from '@/assets/api.js';
  import BranchTable from '@/components/BranchTable.vue';

  export default {
    data() {
      return {
        id: this.$route.params.id,
        last_job: undefined,
        details: undefined,
      }
    },
    mounted() {
      axios
        .get(api.call('api/branch', this.id, 'last_job'))
        .then((res) => (this.last_job = res.data));
      axios
        .get(api.call('api/branch', this.id, 'details'))
        .then((res) => (this.details = res.data.details));
    },
    components: {
      BranchTable
    }
  };
</script>
<style>
.indent{
  margin-left: 5pt;
}
</style>
