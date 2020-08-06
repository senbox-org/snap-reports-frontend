<template>
  <div class="notification">
    <article>
      <p class="subtitle">branch</p>
      <p class="title">{{id}} <b-button @click="compare()">Compare</b-button></p>
      <b-tabs card>
        <b-tab-item label="Branch overview">
          <span class="lighttext">Number of jobs:</span> {{n_jobs}} <br>
          <span class="lighttext">Last execution:</span> {{last_job.timestamp_start}}  - <b> (Job <router-link :to="'/job/'+last_job.ID">#{{last_job.ID}}</router-link>)</b><br>
          <BranchOverview :branch="id"/>
          <br>
          <p class="subcategory">Branch History</p>
          <b-field grouped group-multiline>
            <b-field label="Field"  >
              <b-select v-model="field" @input="update">
                <option value="duration">Duration</option>
                <option value="cpu_time">CPU time</option>
                <option value="memory_avg">Memory</option>
                <option value="io_read">IO Read</option>
              </b-select>
            </b-field>
            <b-field label="Mode">
              <b-select v-model="mode"  @input="update">
                <option value="1">No average</option>
                <option value="5">Moving average 5</option>
                <option value="10">Moving average 10</option>
              </b-select>
            </b-field>
          </b-field>
          <Plotly v-if="history != undefined" :data="history_plot()" :layout="layout()"  :display-mode-bar="false"/>
        </b-tab-item>
        <b-tab-item label="Branch details">
          <BranchDashes :branch="id"/>
          <BranchTable :branch="id"/>
        </b-tab-item>
        <b-tab-item label="Histograms">
          <BranchHisto :branch="id"/>
        </b-tab-item>
      </b-tabs>
    </article>
  </div>
</template>
<script>
  const axios = require('axios').default;

  import api from '@/assets/api.js';
  import { Plotly } from 'vue-plotly'
  import router from '@/router'

  import BranchDashes from '@/components/BranchDashes.vue';
  import BranchTable from '@/components/BranchTable.vue';
  import BranchOverview from '@/components/BranchOverview.vue';
  import BranchHisto from '@/components/BranchHisto.vue';
  import BranchList from '@/components/BranchList.vue';

  export default {
    data() {
      return {
        id: this.$route.params.id,
        history: undefined,
        last_job: undefined,
        n_jobs: 0,
        field: "cpu_time",
        mode: "5",
        title: {
          cpu_time: "CPU Time",
          memory_avg: "Memory",
          duration: "Duration",
          io_read: "IO Read"
        },
      }
    },
    mounted() {
      axios
        .get(api.call('api/branch', this.id, 'last_job'))
        .then((res) => (this.last_job = res.data));
      
      axios
        .get(api.call('api/branch', this.id, 'njobs'))
        .then((res) => (this.n_jobs = res.data.njobs));
      this.update()
    },
    methods: {
      compare() {
        this.$buefy.modal.open({
          parent: this,
          component: BranchList,
          hasModalCard: true,
          trapFocus: true,
          events: {
            'selectBranchEvent': value => {
              let url = "/branch/compare/"+this.id+'/'+value;
              router.push(url);
            }
          }
        })
      },
      update() {
        axios
          .get(api.call('api/branch', this.id,'history/scheduled', this.field, this.mode))
          .then((res) => (this.history = res.data))
      },
      history_plot() {
        if (this.history == undefined || this.history.date.length == 0)
          return [];
        var res = [
        {
          name: 'history',
          x: this.history.date,
          y: this.history.value
        }]
        return res;
      },
      layout() {
        return {
          title: this.title[this.field],
          yaxis: {
            title:'Improvement value (%) '
          },
          xaxis: {
            title:'Date'
          }
        }
      }
    },
    components: {
      BranchTable,
      BranchOverview,
      BranchHisto,
      BranchDashes,
      Plotly
    }
  };
</script>
<style>
.indent{
  margin-left: 5pt;
}
.subcategory {
  font-size: 18px;
  text-decoration: underline
}
</style>
