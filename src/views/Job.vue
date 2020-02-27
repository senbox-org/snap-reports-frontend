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
      <b-table
        paginated
        per-page="10"
        :data="prepare_data()"
        :row-class="(row, index) => row.result"
        detailed
        hoverable
        custom-detail-row
        detail-key="index"
        @details-open="(row, index) => $buefy.toast.open(`Testset ${row.name}`)"
        show-detail-icon
      >
        <template slot-scope="props">
          <b-table-column field="name" label="Name" sortable>
            {{ props.row.name }}
          </b-table-column>
          <b-table-column field="num_tests" label="Tests" sortable centered>
            <svg width="200" height="45">
              <StatLine :total="props.row.num_tests" :passed="props.row.passed"/>
            </svg>
          </b-table-column>
          <b-table-column field="duration" label="Duration" sortable numeric>
            {{ props.row.duration }} s
          </b-table-column>
          <b-table-column field="result" label="Result" sortable>
            {{ props.row.result }}
          </b-table-column>
        </template>
        <template slot="detail" slot-scope="props">
          <tr v-for="item in props.row.tests" :key="item.name" :class="item.result.tag+'_LIGHT'">
            <td > #{{ item.ID }} </td>
            <td >&nbsp;&nbsp;&nbsp;&nbsp;{{ item.name }}</td>
            <td > </td>
            <td style="text-align: right"> {{ item.profile.duration }} s</td>
            <td > {{ item.result.tag }} </td>
          </tr>
        </template>
      </b-table>
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
        {tag: "SNAP version", id: "dockerTag.name"},
        {tag: "Branch", id: "branch"},
        {tag: "Test scope", id: "testScope"},
        {tag: "Started", id: "timestamp_start"},
        {tag: "Ended", id: "timestamp_end"},
        {tag: "Status", id: "result.tag", status: true}
      ],
      columns: [
        {
          field: 'name',
          label: 'Testset',
          sortable: true
        },
        {
          field: 'num_tests',
          label: 'Number of tests',
          numeric: true,
          sortable: true
        },
        {
          field: 'duration',
          label: 'Duration',
          key: 'duration',
          numeric: true,
          sortable: true
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
      .get("http://localhost:9090/api"+this.id+"/summary/testsets")
      .then(res =>(this.summary = res.data))
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
      for (var testset in this.summary.testsets) {
        var row = {
          name: testset,
          num_tests: 0,
          cpu_time: 0,
          memory_avg: 0,
          duration: 0,
          passed: 0,
          result: 'SUCCESS',
          tests: []
        }
        for (var id in this.summary.testsets[testset]) {
          var test = this.summary.testsets[testset][id];
          row.num_tests ++;
          row.duration += test.profile.duration;
          if (test.result.tag == 'FAILED') {
            row.result = 'FAILED';
          } else {
            row.passed ++;
          }
          row.tests.push(test);
        }
        rows.push(row)
      }
      return rows;
    }
  },
}

</script>
<style scoped>
  .SUCCESS_LIGHT {
    background-color: rgba(125, 255, 125, 0.1);
  }
  .FAILED_LIGHT {
    background-color: rgba(255, 125, 125, 0.1);
  }
</style>
