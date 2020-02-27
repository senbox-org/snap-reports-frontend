<template>
  <div class="overview">
    <JobsTable :jobs="info" />
  </div>
</template>

<script>
import JobsTable from '@/components/JobsTable.vue';
const axios = require('axios').default;

export default {
  name: 'Overview',
  data () {
    return {
      info: {}
    }
  },
  mounted() {
    axios
      .get("http://localhost:9090/api/job/list")
      .then(res =>(this.info = res.data));
  },
  components: {
    JobsTable
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #42b983;
}
</style>
