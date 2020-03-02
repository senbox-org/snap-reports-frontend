<template>
  <b-table
  paginated
  per-page="8"
  :data="data"
  :default-sort="['test.ID', 'asc']"
  hoverable>
    <template slot-scope="props">
      <b-table-column field="test.ID" label="ID" sortable numeric>
        {{ props.row.test.ID }}
      </b-table-column>
      <b-table-column field="test.name" label="Name" sortable>
        {{ props.row.test.name}}
      </b-table-column>
      <b-table-column v-for="col in cols" :key="col.title" :label="col.title" numeric>
        <table class="compact">
          <tr><td>last:</td><td>{{props.row[col.field].last}} {{col.unit}}</td></tr>
          <tr><td>last 10:</td><td>{{props.row[col.field].last10.toFixed(1)}} {{col.unit}}</td></tr>
          <tr><td>all:</td><td>{{props.row[col.field].average.toFixed(1)}} {{col.unit}}</td></tr>
          <tr><td>reference</td><td>{{props.row[col.field].reference.toFixed(1)}} {{col.unit}}</td></tr>
        </table>
      </b-table-column>
    </template>
  </b-table>

</template>
<script>
export default {
  name: "BranchTable",
  props: {
    data: Array,
  },
  data() {
    return {
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
  padding: 0px 10px;
}

</style>
