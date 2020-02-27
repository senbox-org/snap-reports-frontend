<template>
  <div>
    <b-table
      :paginated="true"
      :data="jobs.jobs"
      :columns="columns"
      :default-sort="['ID', 'desc']"
      hoverable
      :row-class="(row, index) => row.result.tag"
      @click="rowClicked"
    >
    </b-table>
  </div>
</template>
<script>
import router from '../router'

export default {
  name: 'JobsTable',
  data() {
    return {
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
  props: {
    jobs: Object
  },
  methods: {
    rowClicked(record) {
      router.push("/job/"+record["ID"]);
    }
  }
}
</script>
<style>


.SUCCESS {
  background-color: rgba(125, 255, 125, 0.2);
}
.FAILED {
  background-color: rgba(255, 125, 125, 0.2);
}
</style>
