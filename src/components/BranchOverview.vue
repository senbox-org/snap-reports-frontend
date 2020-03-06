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
          <b-tag :type="props.row.status('cpu')">
            {{ props.row.cpu() }}
          </b-tag>
        </b-table-column>
        <b-table-column field="memory" label="Average Memory" numeric>
          <b-tag :type="props.row.status('memory')">
            {{ props.row.memory() }}
          </b-tag>
        </b-table-column>
        <b-table-column field="read" label="IO Read" numeric>
          <b-tag :type="props.row.status('read')">
            {{ props.row.read() }}
          </b-tag>
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
            status: (field) => (this.total(field) > this.ref(field)? "is-danger" : "is-success")
          },
          {
            title: 'Reference',
            cpu: () => (this.ref('cpu').toFixed(1) + ' s'),
            memory: () => (this.ref('memory').toFixed(1) + ' Mb'),
            read: () => (this.ref('read').toFixed(1)),
            status: () => undefined
          },
          {
            title: 'Difference',
            cpu: () => ((this.total('cpu') - this.ref('cpu')).toFixed(1) + ' s'),
            memory: () => ((this.total('memory') - this.ref('memory')).toFixed(1) + ' Mb'),
            read: () => ((this.total('read') - this.ref('read')).toFixed(1)),
            status: (field) => (this.total(field) > this.ref(field)? "is-danger" : "is-success")
          },
          {
            title: 'Improved tests',
            cpu: () => (this.improved('cpu') + '/' + this.data.length),
            memory: () => (this.improved('memory') + '/' + this.data.length),
            read: () => (this.improved('read') + '/' + this.data.length),
            status: () => undefined
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
