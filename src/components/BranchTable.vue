<template>
  <section>
    <b-field label="Statistics">
      <b-select v-model="sel">
        <option value="last">Last</option>
        <option value="last10">Last 10</option>
        <option value="average">All</option>
      </b-select>

    </b-field>
    <b-table
    paginated
    per-page="8"
    :data="data"
    @click="open"
    :default-sort="['test.ID', 'asc']"
    hoverable>
      <template slot-scope="props">
        <b-table-column field="test.ID" label="ID" sortable numeric>
          {{ props.row.test.ID }}
        </b-table-column>
        <b-table-column field="test.name" label="Name" sortable>
          {{ props.row.test.name}}<br>
          <span class="lighttext">N. of executions: {{props.row.executions}}</span>
        </b-table-column>
        <b-table-column v-for="col in cols" :key="col.title" :label="col.title" :field="col.field+'.'+sel" centered sortable>
          <table class="compact">
            <tr><td align>value</td>
              <td align><b-tag size="is-medium" :type="getType(props.row[col.field][sel], props.row[col.field].reference)">
                {{props.row[col.field][sel].toFixed(1)}} {{col.unit}}</b-tag></td></tr>
            <tr><td align>reference</td>
              <td align><b-tag size="is-medium">{{props.row[col.field].reference.toFixed(1)}} {{col.unit}}</b-tag></td></tr>
          </table>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>
<script>
import router from '../router'

export default {
  name: "BranchTable",
  props: {
    data: Array,
  },
  data() {
    return {
      sel: 'last10',
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
      router.push("/test/"+record.test.ID);
    }
  }
}
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
