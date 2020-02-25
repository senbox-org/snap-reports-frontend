<template>
  <div class="jobs">
    <Overview />
  </div>
</template>

<script>
// @ is an alias to /src
import Overview from '@/components/Overview.vue';


export default {
  name: 'jobs',
  components: {
    Overview
  },
}

</script>
<style scoped>
.jobs {
  margin: 0;
  padding: 0;
}
</style>
