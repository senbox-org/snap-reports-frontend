<template>
  <div class="overview">
    <JobTable :jobs="info" />
  </div>
</template>

<script>
import JobTable from '@/components/JobTable.vue';
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
    JobTable
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #42b983;
}
</style>
