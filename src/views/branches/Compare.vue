<template>
  <div class="notification">
    <article>
      <p class="subtitle">Compare</p>
      <p class="title">{{tag_a}} <span class="vs">VS</span> {{tag_b}}</p>     
    </article>
  </div>
</template>
<script>
  const axios = require('axios').default;
  import api from '@/assets/api.js';

  export default {
    data() {
      return {
        tag_a: this.$route.params.tag_a,
        tag_b: this.$route.params.tag_b,
      }
    },
    mounted() {
      axios
        .get(api.call('api/branch/compare', this.tag_a, this.tag_b, 'duration'))
        .then((res) => (this.last_job = res));
    },
    methods: {
    },
    components: {
    }
  };
</script>
<style>
.vs {
  font-style: normal;
  font-weight: lighter;
  color: #aaa;
}
</style>
