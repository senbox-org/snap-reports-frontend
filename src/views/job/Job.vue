<template>
  <div class="notification">
    <article>
      <p class="subtitle">GPT test job summary</p>
      <p class="title">{{job.jobnum}} (#{{job.ID}})</p>
      <b>SNAP version:</b> <router-link :to="'/branch/'+branch">{{branch}}</router-link><br>
      <Info v-for="(field, index) in fields_job" :key="index" :tag="field.tag" :value="getvalue(job, field.id)" :class="field.status ? getvalue(job, field.id) : undefined" />
      <p class="stats">
        <svg width="100%" height="45">
          <StatLine :total="summary.num_tests" :passed="summary.passed"/>
        </svg>
      </p>
      <section>
        <b-tabs v-model="activeTab">
          <b-tab-item label="Summary">
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
      .get("http://localhost:9090/api/job/"+this.id)
      .then(function(res){
        obj.job = res.data;
        obj.branch= res.data.dockerTag.name.split(':')[1];
      });
    axios
      .get("http://localhost:9090/api/job/"+this.id+"/summary/testsets")
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
          if (test.result.tag == 'FAILED') {
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
}

</script>
