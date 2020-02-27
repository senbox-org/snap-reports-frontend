<template>
  <div class="notification">
    <article>
      <p class="subtitle">GPT test job summary</p>
      <p class="title">{{job.jobnum}} (#{{job.ID}})</p>
      <Info v-for="(field, index) in fields_job" :key="index" :tag="field.tag" :value="getvalue(job, field.id)" :class="field.status ? getvalue(job, field.id) : undefined" />
      <p class="stats">
        <svg width="100%" height="45">
          <StatLine :total="summary.num_tests" :passed="summary.passed"/>
        </svg>
      </p>
      <div v-for="(test, index) in summary.tests" :key="index">
        {{test}}
      </div>
    </article>
  </div>
</template>

<script>
import Info from '@/components/Info.vue';
import StatLine from '@/components/StatLine.vue';

const axios = require('axios').default;

export default {
  name: 'job',
  data() {
    return {
      id: this.$route.fullPath,
      job: undefined,
      summary: undefined,
      fields_job: [
        {
          tag: "SNAP version",
          id: "dockerTag.name"
        },
        {
          tag: "Branch",
          id: "branch"
        },
        {
          tag: "Test scope",
          id: "testScope"
        },
        {
          tag: "Started",
          id: "timestamp_start"
        },
        {
          tag: "Ended",
          id: "timestamp_end"
        },
        {
          tag: "Status",
          id: "result.tag",
          status: true,
        }
      ]
    }
  },
  components: {
    Info,
    StatLine
  },
  mounted() {
    axios
      .get("http://localhost:9090/api"+this.id)
      .then(res =>(this.job = res.data));
    axios
      .get("http://localhost:9090/api"+this.id+"/summary")
      .then(res =>(this.summary = res.data))
  },
  methods: {
    getvalue: function(obj, key) {
      var val = obj;
      var keys = key.split('.');
      for (var k in keys){
        val = val[keys[k]];
      }
      return val;
    }
  },
}

</script>
<style scoped>
</style>
