<template>
<div>
  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child notification">
            <p class="subtitle">last GPT test job</p>
            <p class="title">{{job?.jobnum}} (<router-link :to="`/job/${job?.ID}`">#{{ job?.ID }}</router-link>)</p>
            <p class="job" v-if="job">
              <Info v-for="(field, index) in fields_job" :key="index" :tag="field.tag" :value="getvalue(job, field.id)" :class="field.status ? getvalue(job, field.id) : undefined" />
            </p>
            <p class="stats" v-if="summary">
              <svg width="100%" height="45">
                <StatLine :total="summary.num_tests" :passed="summary.passed"/>
              </svg>
            </p>
            <router-link to="/jobs" tag="b-button">All jobs</router-link>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child notification">
            <p class="subtitle">development branch</p>
            <p class="title"><router-link to="/branch/master">master</router-link></p>
            <p class="job">
              <BranchStatus branch="master"/>
            </p>
            <router-link to="/branches" tag="b-button">All branches</router-link>
          </article>
        </div>
      </div>
    </div>
  </div>
  <article class="notification">
    <BranchDashes branch="master"/>
  </article>
</div>
</template>
<script>
import Info from '@/components/Info.vue';
import StatLine from '@/components/StatLine.vue'
import BranchStatus from '@/components/BranchStatus.vue'
import BranchDashes from '@/components/BranchDashes.vue'

import api from '@/assets/api.js';

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
  mounted() {
    axios
      .get(api.call("api/job/last"))
      .then(res =>(this.job = res.data));
    axios
      .get(api.call("api/job/last/summary"))
      .then(res =>(this.summary = res.data))

  },
  methods: {
    getvalue: function(obj, key) {
      let val = {...obj};
      const keys = key.split('.');
      for (let k in keys){
        val = val[keys[k]];
      }
      return val;
    }
  },
  components: {
    Info,
    StatLine,
    BranchStatus,
    BranchDashes
  }
};
</script>
<style>
.job{
  padding: 0;
  margin: 0;
  word-break: break-word;
  box-sizing: inherit;
  font-size: 12pt;
}
</style>
