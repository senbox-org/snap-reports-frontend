<template>
  <div>
    <b-table
      :paginated="true"
      :data="jobs"
      :columns="columns"
      :default-sort="['ID', 'desc']"
      hoverable
      :row-class="(row, index) => row.result.tag"
      @click="rowClicked"
    >
    </b-table>
    <div v-show="debug">
      {{jobs}}
    </div>
  </div>
</template>
<script>
import router from '../router'
import api from '@/assets/api.js';

const axios = require('axios').default;

export default {
  name: 'JobsTable',
  data() {
    return {
      jobs: undefined,
      columns: [
        {
          field: 'ID',
          label: 'ID',
          numeric: true,
          sortable: true
        },
        {
          field: 'jobnum',
          label: 'Job Number',
          numeric: true,
          sortable: true
        },
        {
          field: 'dockerTag.name',
          label: 'Branch',
          centered: true,
          sortable: true
        },
        {
          field: 'testScope',
          label: 'Test Scope',
          centered: true,
          sortable: true
        },
        {
          field: 'timestamp_start',
          label: 'Time stamp',
          centered: true,
          sortable: true
        },
        {
          field: 'result.tag',
          label: 'Result',
          centered: true,
          sortable: true
        }
      ]
    }
  },
  methods: {
    rowClicked(record) {
      router.push("/job/"+record["ID"]);
    }
  },
  mounted() {
    axios
      .get(api.call("api/job/list"))
      .then(res =>(this.jobs = res.data));
  },
};
</script>
<style>


.SUCCESS {
  background-color: rgba(125, 255, 125, 0.2);
}
.FAILED {
  background-color: rgba(255, 125, 125, 0.2);
}
.CRASHED {
  background-color: rgba(255, 125, 125, 0.2); 
}
</style>
