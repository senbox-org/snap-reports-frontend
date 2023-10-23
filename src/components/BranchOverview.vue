<template>
  <section>
    <b-field label="Statistics">
      <b-select v-model="sel" @input="update">
        <option value="1">Last</option>
        <option value="10">Last 10</option>
        <option value="0">All</option>
      </b-select>

    </b-field>
    <b-table :data="rows">
      <template slot-scope="props" v-if="props.row">
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
  import api from '@/assets/api.js';

  const axios = require('axios').default;

  export default {
    name: 'BranchOverview',
    props: {
      branch: String
    },
    data() {
      return {
        data: undefined,
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
        sel: '10'
      }
    },
    methods: {
      total(field) {
        const reducer = (acc, val) => acc + val['res_'+field];
        return this.data.reduce(reducer, 0);
      },

      ref(field) {
        const reducer = (acc, val) => acc + val['ref_'+field];
        return this.data.reduce(reducer, 0);
      },
      improved(field) {
        const reducer = (acc, val) => acc + (val['res_'+field] < val['ref_'+field] ? 1 : 0);
        return this.data.reduce(reducer, 0);
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
