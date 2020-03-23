<template>
  <section>
    <b-field grouped group-multiline>
      <b-field label="Statistics">
        <b-select v-model="stat"  @input="update">
          <option value="1">Last</option>
          <option value="10">Last 10</option>
          <option value="0">All</option>
        </b-select>
      </b-field>

      <b-field label="Mode">
        <b-select v-model="mode">
          <option value="abs">Absolute</option>
          <option value="rel">Relative</option>
        </b-select>
      </b-field>

    </b-field>
    <div>
      <div class="hw">
        <Plotly
        :data="hist('cpu', mode, stat)"
        :layout="layout('CPU Time', 'Time (s)')"
        :display-mode-bar="false"/>
      </div>
      <div class="hw">
        <Plotly
        :data="hist('memory', mode, stat)"
        :layout="layout('Average Memory', 'Memory (Mb)')"
        :display-mode-bar="false"/>
      </div>
    </div>
    <div>
      <div class="hw">
        <Plotly
        :data="hist('read', mode, stat)"
        :layout="layout('IO Read', 'IO Counter (#)')"
        :display-mode-bar="false"/>
      </div>
      <div class="hw">
      </div>
    </div>
  </section>
</template>
<script>
import { Plotly } from 'vue-plotly'
import api from '@/assets/api.js';

const axios = require('axios').default;

export default {
  name: 'BranchHisto',
  props: {
    branch: String
  },
  data() {
    return {
      data: undefined,
      mode: 'rel',
      stat: '10',
    }
  },
  methods: {
    hist(field, mode){
      var xs;
      if (mode == 'abs') {
        xs = this.data.map(x =>(x['res_'+field] - x['ref_'+field]))
      } else {
        xs = this.data.map(x =>(-100 * (x['res_'+field] - x['ref_'+field])/x['ref_'+field]))
      }
      return [{
        x: xs,
        type: 'histogram'
      }];
    },
    layout(title, unit) {
      var unit_title = ""
      if (this.mode == 'abs')
        unit_title = unit + '<br> (smaller is better)'
      else
        unit_title = "Improvement (%) <br> (bigger is better)"
      return {
        title: title + '<br>Difference with Reference',
        yaxis: {
          title: '# exectuions'
        },
        xaxis: {
          title: unit_title
        }
      }
    },
    update() {
      axios
      .get(api.call('api/branch', this.branch, 'details', this.stat))
      .then((res) => (this.data = res.data.details));
    }
  }, 
  mounted() {
    this.update()
  },
  components: {
    Plotly
  }
}
</script>
