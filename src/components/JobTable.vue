<template>

      <b-table
      paginated
      per-page="10"
      :data="data"
      :default-sort="['name', 'asc']"
      :row-class="(row, index) => (row.result == 'FAILED' ? 'FAILED' : undefined)"
      detailed
      hoverable
      custom-detail-row
      detail-key="name"
      show-detail-icon>
        <template slot-scope="props">
          <b-table-column field="name" label="Name" sortable>
            {{ props.row.name }}
          </b-table-column>
          <b-table-column field="num_tests" label="Tests" sortable centered>
            <svg width="200" height="45">
              <StatLine :total="props.row.num_tests" :passed="props.row.passed"/>
            </svg>
          </b-table-column>
          <b-table-column field="duration" label="Duration" sortable numeric>
            <div v-if="props.row.duration_ref == 0">
              {{ props.row.duration }} s <br>
              <span class="subtext">ref: - </span>
            </div>
            <div v-else>
              <div :class="props.row.duration < props.row.duration_ref ? 'good' : 'bad bold'">{{ props.row.duration }} s </div>
              <span class="subtext">ref: {{ props.row.duration_ref.toFixed(1)}} s</span>
            </div>
          </b-table-column>
          <b-table-column field="cpu_time" label="CPU time" sortable numeric>
            <div v-if="props.row.cpu_time_ref == 0">
              {{ props.row.cpu_time }} s <br>
              <span class="subtext">ref: - </span>
            </div>
            <div v-else>
              <div :class="props.row.cpu_time < props.row.cpu_time_ref ? 'good' : 'bad bold'">
                {{ props.row.cpu_time }} s
              </div>
              <span class="subtext">ref: {{ props.row.cpu_time_ref.toFixed(1) }} s</span>
            </div>
          </b-table-column>
          <b-table-column field="memory_avg" label="Memory" sortable numeric>
            <div v-if="props.row.cpu_time_ref == 0">
              {{ props.row.memory_avg }} Mb <br>
              <span class="subtext">ref: - </span>
            </div>
            <div v-else>
              <div :class="props.row.memory_avg < props.row.memory_avg_ref ? 'good' : 'bad bold'">
                {{ props.row.memory_avg }} Mb
              </div>
              <span class="subtext">ref: {{ props.row.memory_avg_ref.toFixed(0) }} Mb</span>
            </div>
          </b-table-column>
          <b-table-column field="result" label="Result" sortable>
            <div :class="props.row.result == 'SUCCESS' ? 'good' : 'bad bold'">
              {{ props.row.result }}
            </div>
          </b-table-column>
        </template>
        <template slot="detail" slot-scope="props">
          <tr
          v-for="item in props.row.tests"
          :key="item.name"
          @click="(row) => showInfo(item.ID)"
          :class="item.result.tag+'_LIGHT'">
            <td > #{{ item.ID }} </td>
            <td >&nbsp;&nbsp;&nbsp;&nbsp;{{ item.name }}</td>
            <td > </td>
            <td v-if="item.reference != null " class="text-right">
              <div :class="item.profile.duration < item.reference.duration ? 'good' : 'bad bold'"> {{ item.profile.duration }} s </div>
              <span class="subtext">ref: {{item.reference.duration.toFixed(1)}} s</span>
            </td>
            <td v-else class="text-right">
              {{ item.profile.duration }} s <br>
            </td>
            <td v-if="item.reference != null" class="text-right">
              <div :class="item.profile.cpu_time < item.reference.cpu_time ? 'good' : 'bad bold'"> {{ item.profile.cpu_time }} s </div>
              <span class="subtext">ref: {{item.reference.cpu_time.toFixed(1)}} s</span>
            </td>
            <td v-else class="text-right">
              {{ item.profile.cpu_time }} s
            </td>
            <td v-if="item.reference != null" class="text-right">
              <div :class="item.profile.memory_avg < item.reference.memory_avg ? 'good' : 'bad bold'"> {{ item.profile.memory_avg }} Mb </div>
              <span class="subtext">ref: {{item.reference.memory_avg.toFixed(0) }} Mb</span>
            </td>
            <td v-else class="text-right"> {{ item.profile.memory_avg }} Mb </td>
            <td > {{ item.result.tag }} </td>
          </tr>
        </template>
      </b-table>
</template>
<script>
  export default {
    name: 'JobTable',
    props: {
      data: Array
    }
  }
</script>
<style scoped>
  .SUCCESS_LIGHT {
    background-color: rgba(125, 255, 125, 0.1);
  }
  .FAILED_LIGHT {
    background-color: rgba(255, 125, 125, 0.1);
  }
  .text-right {
    text-align: right;
  }
  .subtext{
    font-size: 10pt;
    font-weight: 300;
  }
  .lighttext{
    font-weight: 300;
  }

  .good {
    color: rgb(0, 100, 0);
  }
  .bad {
    color: rgb(100, 0, 0);
  }
  .bold {
    font-weight: bold;
  }
</style>
