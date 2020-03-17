<template>
  <div class="overview">
    <JobsTable/>
  </div>
</template>

<script>
import JobsTable from '@/components/JobsTable.vue';

export default {
  name: 'Overview',
  components: {
    JobsTable
  },
}
</script>

<style scoped>

a {
  color: #42b983;
}
</style>
