<template>
  <div class="notification">
    <article>
      <p class="subtitle">Test Set: {{test.testset}}</p>
      <p class="title">{{test.name}} (#{{test.ID}})</p>
      <Info tag="Author" :value="test.author"/>
      <Info tag="Frequency" :value="test.frequency"/>
      <Info tag="Description" :value="test.description"/>
      <Info tag="Graph path" :value="test.graphPath"/><br>
      <Info tag="Number of executions" :value="count"/>
      <b>Last execution:</b> <br>
      <span class="indent lighttext">Job: <router-link :to="'/job/'+last_job.ID">#{{last_job.ID}}</router-link></span><br>
      <span class="indent lighttext">Date: {{last_job.timestamp_start}}</span><br>
      <span class="indent lighttext">Execution summary: <router-link :to="'/job/'+last_job.ID+'/test/'+test.ID+'?branch='">#{{last_job.ID}}/{{test.ID}}</router-link></span>
      <b-tabs>
        <b-tab-item label="Overview">
          <TestOverview :test="id"/>
        </b-tab-item>
        <b-tab-item label="History">
          <TestHistory :test="id"/>
        </b-tab-item>
        <b-tab-item label="Histogram">
          <TestHisto :test="id"/>
        </b-tab-item>
      </b-tabs>
    </article>
  </div>
</template>
<script>
import api from '@/assets/api.js';
import Info from '@/components/Info.vue';
import TestOverview from '@/components/TestOverview.vue';
import TestHistory from '@/components/TestHistory.vue';
import TestHisto from '@/components/TestHisto.vue';


const axios = require('axios').default;

export default {
  name: 'Test',
  data() {
    return {
      id: this.$route.params.id,
      test: {},
      count: 0,
      last_job: {},
    }
  },
  mounted() {
    axios
      .get(api.call('api/test', this.id))
      .then((res) => (this.test = res.data));
    axios
      .get(api.call('api/test', this.id, 'count'))
      .then((res) => (this.count = res.data.count));
    axios
      .get(api.call('api/test', this.id, 'last_job'))
      .then((res) => (this.last_job = res.data));
  },
  components: {
    Info,
    TestOverview,
    TestHistory,
    TestHisto
  }
}
</script>
