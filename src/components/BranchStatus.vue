<template>
  <div>
    <Info tag="Number of tests" :value="stats?.count"/>
    <b>Improvements</b><br>
    <div class="branchstatus">
      <SimpleStatsView
        tag="CPU Time"
        :data="stats?.cpu"
        :total="stats?.count"
        :improved="stats?.improved?.cpu"
        :regressed="stats?.regressed?.cpu"
      />
      <SimpleStatsView
        tag="Memory"
        :data="stats?.memory"
        :total="stats?.count"
        :improved="stats?.improved?.memory"
        :regressed="stats?.regressed?.memory"
      />
      <SimpleStatsView
        tag="IO Read"
        :data="stats?.read"
        :total="stats?.count"
        :improved="stats?.improved?.read"
        :regressed="stats?.regressed?.read"
      />
      <SimpleStatsLegend/>
    </div>
  </div>
</template>
<script>
  import SimpleStatsView from '@/components/SimpleStatsView.vue';
  import SimpleStatsLegend from '@/components/SimpleStatsLegend.vue';
  import Info from '@/components/Info.vue';

  import api from '@/assets/api.js';

  const axios = require('axios').default;

  export default {
    name: 'BranchStatus',
    data() {
      return {
        stats: {
          count: 0
        }
      }
    },
    props: {
      branch: String
    },
    mounted() {
      axios
        .get(api.call('api/branch', this.branch, 'summary'))
        .then(res =>(this.stats = res.data));
    },
    components: {
      SimpleStatsView,
      SimpleStatsLegend,
      Info
    }
  };
</script>
