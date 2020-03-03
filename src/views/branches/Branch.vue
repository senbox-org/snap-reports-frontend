<template>
  <div class="notification">
    <article>
      <p class="subtitle">branch</p>
      <p class="title">{{id}}</p>

      <b-tabs card>

        <b-tab-item label="Branch overview">
          <span class="lighttext">Number of jobs:</span> {{n_jobs}} <br>
          <span class="lighttext">Last execution:</span> {{last_job.timestamp_start}}  - <b> (Job <router-link :to="'/job/'+last_job.ID">#{{last_job.ID}}</router-link>)</b><br>
          <span class="lighttext">Number of tests:</span> {{details.length}}<br>
          <BranchOverview :data="details"/>
        </b-tab-item>
        <b-tab-item label="Branch details">
          <BranchTable :data="details"/>
        </b-tab-item>
        <b-tab-item label="Histograms">
          <BranchHisto :data="details"/>
        </b-tab-item>
      </b-tabs>
    </article>
  </div>
</template>
<script>
  const axios = require('axios').default;

  import api from '@/assets/api.js';
  import BranchTable from '@/components/BranchTable.vue';
  import BranchOverview from '@/components/BranchOverview.vue';
  import BranchHisto from '@/components/BranchHisto.vue';

  export default {
    data() {
      return {
        id: this.$route.params.id,
        last_job: undefined,
        details: undefined,
        n_jobs: 0,
      }
    },
    mounted() {
      axios
        .get(api.call('api/branch', this.id, 'last_job'))
        .then((res) => (this.last_job = res.data));
      axios
        .get(api.call('api/branch', this.id, 'details'))
        .then((res) => (this.details = res.data.details));
      axios
        .get(api.call('api/branch', this.id, 'njobs'))
        .then((res) => (this.n_jobs = res.data.njobs));
    },
    components: {
      BranchTable,
      BranchOverview,
      BranchHisto
    }
  };
</script>
<style>
.indent{
  margin-left: 5pt;
}
</style>
