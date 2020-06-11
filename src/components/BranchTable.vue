<template>
  <section>
    <b-field label="Statistics">
      <b-select v-model="sel"  @input="update">
        <option value="1">Last</option>
        <option value="10">Last 10</option>
        <option value="0">All</option>
      </b-select>

    </b-field>
    <b-table
    :data="data"
    @click="open"
    :default-sort="['test.ID', 'asc']"
    hoverable>
      <template slot-scope="props">
        <b-table-column field="test_ID" label="ID" sortable numeric>
          {{ props.row.test_ID}}
        </b-table-column>
        <b-table-column field="test_name" label="Name" sortable>
          {{ props.row.test_name}}<br>
          <span class="lighttext">N. of executions: {{props.row.num_exec}}</span>
        </b-table-column>
        <b-table-column v-for="col in cols" :key="col.title" :label="col.title" :field="col.field+'.'+sel" centered sortable>
          <table class="compact">
            <tr><td align class="lighttext">value</td>
              <td align><b-tag  :type="getType(props.row['res_'+col.field], props.row['ref_'+col.field])">
                {{props.row['res_'+col.field].toFixed(1)}} {{col.unit}}</b-tag></td></tr>
            <tr><td align class="lighttext">reference</td>
              <td align><b-tag>{{props.row['ref_'+col.field].toFixed(1)}} {{col.unit}}</b-tag></td></tr>
          </table>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>
<script>
import api from '@/assets/api.js';

const axios = require('axios').default;

import router from '@/router'

export default {
  name: "BranchTable",
  props: {
    branch: String,
  },
  data() {
    return {
      data: undefined,
      sel: '10',
      cols: [
        {
          title: 'CPU Time',
          field: 'cpu',
          unit: 's'
        },
        {
          title: 'Memory',
          field: 'memory',
          unit: 'Mb'
        },
        {
          title: 'IO Read',
          field: 'read',
          unit: '#'
        }
      ]
    }
  },
  methods: {
    getType(value, reference) {
      if (reference == undefined)
        return undefined;
      if (value > reference)
        return "is-danger";
      return "is-success";
    },
    open(record) {
      router.push("/test/"+record.test_ID);
    },
    update() {
        axios
          .get(api.call('api/branch', this.branch, 'details', this.sel))
          .then((res) => (this.data = res.data.details));
      }
  }, 
  mounted() {
    this.update()
  }
};
</script>
<style>

table.compact {
  text-align: right;
  border-collapse: collapse;
  width: 100%;
}
table.compact td, table.compact th {
  padding: 3px 10px;
  border-width: 0;
  text-align: right;
  vertical-align: middle;
}

</style>
