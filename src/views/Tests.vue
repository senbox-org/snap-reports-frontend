<template>
  <div class="notification">
    <article>
      <b-table
      :data="tests"
      :columns="columns"
      :loading="loading"
      @click="open"
      hoverable>
      </b-table>
    </article>
  </div>
</template>
<script>
import api from '@/assets/api.js'
import router from '@/router'

const axios = require('axios').default;

export default {
  name: 'Tests',
  data() {
    return {
      loading: false,
      tests: [],
      columns: [
        {
          field: 'ID',
          label: 'ID',
          numeric: true,
          sortable: true
        },
        {
          field: 'name',
          label: 'Name',
          sortable: true
        },
        {
          field: 'testset',
          label: 'Test Set',
          sortable: true,
        },
        {
          field: 'author',
          label: 'Author',
          sortable: true
        },
        {
          field: 'description',
          label: 'Description',
        },
        {
          field: "frequency",
          label: "Frequency"
        }
      ]
    }
  },
  mounted() {
    axios
      .get(api.call('api/test/list'))
      .then((res) => {
        this.tests = res.data.tests;
        this.loading = false;
      })
      .catch((err) => {
        this.tests = [];
        this.loading = false;
        console.error(err);
      })
  },
  methods: {
    open(record) {
      router.push("/test/"+record.ID);
    }
  }
};
</script>
