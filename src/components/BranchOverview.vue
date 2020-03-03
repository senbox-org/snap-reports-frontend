<template>
  <section>
    <b-field label="Statistics">
      <b-select v-model="sel">
        <option value="last">Last</option>
        <option value="last10">Last 10</option>
        <option value="average">All</option>
      </b-select>

    </b-field>
    <b-table :data="rows">
      <template slot-scope="props">
        <b-table-column field="title" label="">
          <b>{{ props.row.title}}</b>
        </b-table-column>
        <b-table-column field="cpu" label="CPU Time" numeric>
          {{ props.row.cpu() }}
        </b-table-column>
        <b-table-column field="cpu" label="Average Memory" numeric>
          {{ props.row.memory() }}
        </b-table-column>
        <b-table-column field="cpu" label="IO Read" numeric>
          {{ props.row.read() }}
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>
<script>
  export default {
    name: 'BranchOverview',
    props: {
      data: Array
    },
    data() {
      return {
        rows: [
          {
            title: 'Total',
            cpu: () => (this.total('cpu').toFixed(1) + ' s'),
            memory: () => (this.total('memory').toFixed(1) + ' Mb'),
            read: () => (this.total('read').toFixed(1)),
          },
          {
            title: 'Reference',
            cpu: () => (this.ref('cpu').toFixed(1) + ' s'),
            memory: () => (this.ref('memory').toFixed(1) + ' Mb'),
            read: () => (this.ref('read').toFixed(1))
          },
          {
            title: 'Difference',
            cpu: () => ((this.total('cpu') - this.ref('cpu')).toFixed(1) + ' s'),
            memory: () => ((this.total('memory') - this.ref('memory')).toFixed(1) + ' Mb'),
            read: () => ((this.total('read') - this.ref('read')).toFixed(1))
          },
          {
            title: 'Improved tests',
            cpu: () => (this.improved('cpu')),
            memory: () => (this.improved('memory')),
            read: () => (this.improved('read'))
          }
        ],
        sel: 'last10'
      }
    },
    methods: {
      total(field) {
        const reducer = (acc, val) => acc + val[field][this.sel];
        return this.data.reduce(reducer, 0);
      },

      ref(field) {
        const reducer = (acc, val) => acc + val[field].reference;
        return this.data.reduce(reducer, 0);
      },
      improved(field) {
        const reducer = (acc, val) => acc + (val[field][this.sel] < val[field].reference ? 1 : 0);
        return this.data.reduce(reducer, 0);
      },
    }
  };
</script>
