<template>
  <div class="notification">
    <article>
      <p class="subtitle">GPT test job summary</p>
      <p class="title">{{job?.jobnum}} (#{{job?.ID}})</p>
      <b>SNAP version:</b> <router-link :to="'/branch/'+branch">{{branch}}</router-link><br>
      <Info v-for="(field, index) in fields_job" :key="index" :tag="field.tag" :value="getvalue(job, field.id)" :class="field.status ? getvalue(job, field.id) : undefined" />
      <p class="stats">
        <svg width="100%" height="45">
          <StatLine :total="summary.num_tests" :passed="summary.passed"/>
        </svg>
      </p>
      <section>
        <b-tabs v-model="activeTab">
          <b-tab-item label="Overview">
            <b-tooltip v-for="testset in data" :key="testset.name" :label="testset.name" position="is-bottom" class="compress light" type="is-dark" size="is-small">
              <div  class="inline">
                  <div class="compress">
                  <b-tooltip  v-for="test in testset.tests" :key="test.ID" :label="test.name">
                    <button :class="testClass(test)" @click="go_to_test(test)">
                    </button>
                  </b-tooltip>  
                </div>
              </div>
            </b-tooltip>
            <br>
            <div class="legend">
              <b>Legend</b><br>
              <div class="sublegend compress">
                <button class="dash dleg test_failed"></button> <span class="dlabel">Test failed</span>
                <button class="dash dleg test_no_reference"></button> <span class="dlabel">No reference value</span>
                <button class="dash dleg test_severe_degression"></button><span class="dlabel"> Severe degression (&lt;-8%)</span>
                <button class="dash dleg test_degression"></button><span class="dlabel"> Degression (&lt;-3%)</span>
                <button class="dash dleg test_no_change"></button><span class="dlabel"> No changes (&lt;+3%)</span>
                <button class="dash dleg test_improvement"></button><span class="dlabel"> Improvement (&lt;+8%)</span>
                <button class="dash dleg test_severe_improvement"></button><span class="dlabel"> Severe improvement(&gt;+8%)</span>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item label="Performance Summary">
            <element>
              <JobSummaryItem
                v-for="(field, index) in fulljob.fields"
                :key="index"
                :title="field.label"
                :data="field"
                :total="fulljob.total"
                :unit="field.unit"
              />
            </element>
          </b-tab-item>
          <b-tab-item label="Testset table">
            <JobTable :data="data" :job_id="id" :branch="job.dockerTag.name"/>
          </b-tab-item>
        </b-tabs>
      </section>
    </article>
  </div>
</template>

<script>
import Info from '@/components/Info.vue';
import StatLine from '@/components/StatLine.vue';
import JobTable from '@/components/JobTable.vue';
import JobSummaryItem from '@/components/JobSummaryItem.vue';
import router from '@/router'

import api from '@/assets/api.js';

const axios = require('axios').default;

export default {
  name: 'job',
  data() {
    return {
      id: this.$route.params.id,
      branch: undefined,
      job: undefined,
      summary: undefined,
      data: undefined,
      fields_job: [
        {tag: "Branch", id: "branch"},
        {tag: "Test scope", id: "testScope"},
        {tag: "Started", id: "timestamp_start"},
        {tag: "Ended", id: "timestamp_end"},
        {tag: "Status", id: "result.tag", status: true}
      ],
      fulljob: {}
    }
  },
  components: {
    Info,
    JobTable,
    StatLine,
    JobSummaryItem
  },
  mounted() {
    var obj = this;
    axios
      .get(api.call('api/job', this.id))
      .then(function(res){
        obj.job = res.data;
        obj.branch = res.data.dockerTag.name;
      });
    axios
      .get(api.call('api/job', this.id, 'summary/testsets'))
      .then(function(res) {
        obj.summary = res.data
        obj.prepare_data();
      });
  },
  methods: {
    getvalue(obj, key) {
      var val = obj;
      var keys = key.split('.');
      for (var k in keys){
        val = val[keys[k]];
      }
      return val;
    },
    status(test) {
      if (test.result.tag == 'FAILED' || test.result.tag == 'CRASHED')
        return -1;
      if (test.reference == null) {
        return -2;
      }
      return test.profile.duration/test.reference.duration
    },
    testClass(test) {
      let baseClass = 'dash ';
      let value = this.status(test);
      if (value == -1) {
        return baseClass + 'test_failed';
      }
      if (value == -2) {
        return baseClass + 'test_no_reference'
      }
      let rel_value = (1 - value)*100;
      if (rel_value >= 8) {
        return baseClass + 'test_severe_improvement';
      } 
      if (rel_value > 3){
        return baseClass+ 'test_improvement';
      }
      if (rel_value >= -3) {
        return baseClass + 'test_no_change';
      }
      if (rel_value >= -8) {
        return baseClass + 'test_degression'
      } 
      return baseClass + 'test_severe_degression';
    },
    go_to_test(test){
      router.push("/job/"+this.id+"/test/"+test.ID+"?branch="+this.branch);
    },
    prepare_data() {
      var rows = []
      var fulljob = {
          total: 0,
          fields: [
            {
              field: 'cpu_time',
              label: 'CPU Time',
              unit: 's',
              total: 0,
              reference: 0,
              improved: 0
            },
            {
              field: 'duration',
              label: 'Duration',
              unit: 's',
              total: 0,
              reference: 0,
              improved: 0
            },
            {
              field: 'memory_avg',
              label: 'Memory',
              unit: 'Mb',
              total: 0,
              reference: 0,
              improved: 0
            },
            {
              field: 'io_read',
              label: 'IO Read',
              unit: 'b',
              total: 0,
              reference: 0,
              improved: 0,
            }
          ]
      };
      for (var testset in this.summary.testsets) {
        var row = {
          name: testset,
          num_tests: 0,
          cpu_time: 0,
          cpu_time_ref: 0,
          memory_avg: 0,
          memory_avg_ref: 0,
          duration: 0,
          duration_ref: 0,
          io_read_ref:0,
          io_read: 0,
          passed: 0,
          result: 'SUCCESS',
          tests: []
        }
        for (var id in this.summary.testsets[testset]) {
          var test = this.summary.testsets[testset][id];
          row.num_tests ++;
          row.duration += test.profile.duration;
          row.memory_avg += test.profile.memory_avg;
          row.cpu_time += test.profile.cpu_time;
          row.io_read += test.profile.io_read;
          if (test.result.tag != 'SUCCESS') {
            row.result = 'FAILED';
          } else {
            row.passed ++;
          }
          if (test.reference != null) {
            row.memory_avg_ref += test.reference.memory_avg;
            row.cpu_time_ref += test.reference.cpu_time;
            row.duration_ref += test.reference.duration;
            row.io_read_ref += test.reference.io_read
            for (var i in fulljob.fields) {
              var field = fulljob.fields[i].field;
              var value = test.profile[field];
              var reference = test.reference[field];
              fulljob.fields[i].total += value;
              fulljob.fields[i].reference += reference;
              fulljob.fields[i].improved += value < reference ? 1 : 0;
            }
            fulljob.total ++;
          }
          row.tests.push(test);
        }
        rows.push(row)
      }
      this.data = rows;
      this.fulljob = fulljob;
    }
  },
};

</script>
<style>
.inline {
  display: inline-block;
  margin-right: 4px;
  margin-bottom: 2px;
  padding: 4px 8px 8px 8px;
  background-color: #fff;
  border: 1px solid rgba(0,0,0, 0.1);
  border-radius: 3px;
  font-family: Helvetica Neue, Arial, sans-serif;
  font-weight: bold;
  font-size: 12px;
}

.light {
  font-family: Helvetica Neue, Arial, sans-serif;
  font-weight: 200;
  font-size: 10px;
}
</style>
