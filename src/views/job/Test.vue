<template>
  <div class="notification">
    <article>
      <p class="subtitle">job <a @click="back()">#{{job}}</a> <br> execution #{{data.ID}}</p>
      <p class="title">{{data.test.name}} (<router-link :to="`/test/${data.test.ID}`">#{{data.test.ID}}</router-link>)</p>
      <p class="subtitle">result: <b :class="data.result.tag">{{data.result.tag}}</b></p>
      <b>Description</b><br>
      <p class="bm-xs">
        {{data.test.description}}
      </p>
      <Info tag="Author" :value="data.test.author"/>
      <Info tag="Frequency" :value="data.test.frequency"/>
      <Info tag="Graph" :value="data.test.graphPath"/>
      <Info tag="Start" :value="data.start"/>
      <Info tag="Branch" :value="branch" />
      <br>
      <b-table
        :data="fields"
        hoverable
      >
        <template slot-scope="props">
          <b-table-column label="Field">
            {{props.row.tag}}
          </b-table-column>
          <b-table-column  label="Recorded" numeric>
            {{data[props.row.field]}} {{props.row.unit}}
          </b-table-column>
          <b-table-column v-if="reference != null" label="Reference" numeric>
            <p >
              <b-tag size="is-medium" :type="get_type(data[props.row.field], reference[props.row.field])">
                {{reference[props.row.field].toFixed(1)}} {{props.row.unit}}
              </b-tag>
            </p>
            <div :class="'subtext '+get_class(data[props.row.field], reference[props.row.field])">
              {{(data[props.row.field] - reference[props.row.field]).toFixed(1)}} {{props.row.unit}}<br>
              {{data[props.row.field] > reference[props.row.field] ? '+' : ''}}{{((data[props.row.field] / reference[props.row.field] - 1) * 100).toFixed(1)}} %
            </div>
          </b-table-column>
          <b-table-column v-if="local_reference != null" label="Branch Average" numeric>
            <p >
              <b-tag size="is-medium" :type="get_type(data[props.row.field], local_reference[props.row.field].average)">
                {{local_reference[props.row.field].average.toFixed(1)}} {{props.row.unit}}
              </b-tag>
            </p>
            <div :class="'subtext '+get_class(data[props.row.field], local_reference[props.row.field].average)">
              {{(data[props.row.field] - local_reference[props.row.field].average).toFixed(1)}} {{props.row.unit}}<br>
              {{data[props.row.field] > local_reference[props.row.field].average ? '+' : ''}}{{((data[props.row.field] / local_reference[props.row.field].average - 1) * 100).toFixed(1)}} %
            </div>
          </b-table-column>
        </template>
      </b-table>
    </article>
  </div>
</template>
<script>
  import Info from '@/components/Info.vue';
  import router from '@/router'

  const axios = require('axios').default;


  export default {
    name: 'JobTest',
    data() {
      var url = this.$route.fullPath;
      var test_id = url.split('/')[4].split('?')[0];
      var job_id = url.split('/')[2];
      return {
        id: test_id,
        job: job_id,
        url: url,
        data: undefined,
        reference: undefined,
        local_reference: undefined,
        fields: [
          {
            field: 'duration',
            tag: 'Duration',
            unit: 's'
          },
          {
            field: 'cpu_time',
            tag: 'CPU Time',
            unit: 's'
          },
          {
            field: 'memory_avg',
            tag: 'Memory',
            unit: 'Mb'
          },
          {
            field: 'io_read',
            tag: 'IO Read',
            unit: 'b'
          }
        ]
      }
    },
    mounted() {
      axios
        .get("http://localhost:9090/api/job/"+this.job+"/statistics/"+this.id)
        .then((res) => (this.data = res.data));
      axios
        .get("http://localhost:9090/api/test/"+this.id+"/reference")
        .then((res) => (this.reference = res.data));
      axios
        .get("http://127.0.0.1:9090/api/test/"+this.id+"/summary/"+this.branch)
        .then((res) => (this.local_reference = res.data))
    },
    components: {
      Info
    },
    methods: {
      get_class(value, reference) {
        if (value > reference) {
          return 'failed_text';
        } else if (value < reference) {
          return 'success_text';
        }
        return undefined;
      },
      get_type(value, reference) {
        if (value < reference) {
          return 'is-success'
        }
        if (value > reference) {
          return 'is-danger'
        }
        return undefined;
      },
      back() {
        router.back();
      }
    },
    props: {
      branch: String
    }
  }
</script>
<style>
.bm_xs {
  padding-bottom: 1em;
}
.subtext {
  font-size: 10pt;
}

.failed_text {
  color: #ff3860;
  font-weight: 500;
}

.success_text {
  color: #23d160;
  font-weight: 500;
}
</style>
