<template>
  <div class="home">
    <Overview />
  </div>
</template>

<script>
// @ is an alias to /src
import Overview from '@/components/Overview.vue';


export default {
  name: 'Home',
  components: {
    Overview
  },
}

</script>
<style scoped>
.home {
  margin: 0;
  padding: 0;
}
</style>
