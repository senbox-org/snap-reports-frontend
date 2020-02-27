<template>
  <div class="branchstatus">
    <SimpleStatsView
      tag="CPU Time"
      :data="stats.cpu"
      :total="stats.count"
      :improved="stats.improved.cpu"
    />
    <SimpleStatsView
      tag="Memory"
      :data="stats.memory"
      :total="stats.count"
      :improved="stats.improved.memory"
    />
    <SimpleStatsView
      tag="IO Read"
      :data="stats.read"
      :total="stats.count"
      :improved="stats.improved.read"
    />
    <SimpleStatsLegend/>
  </div>
</template>
<script>
  import SimpleStatsView from '@/components/SimpleStatsView.vue';
  import SimpleStatsLegend from '@/components/SimpleStatsLegend.vue';

  export default {
    name: 'BranchStatus',
    props: {
      stats: Object
    },
    components: {
      SimpleStatsView,
      SimpleStatsLegend
    }
  }
</script>
