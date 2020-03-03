<template>
  <section>
    <b-field grouped group-multiline>
      <b-field label="Statistics">
        <b-select v-model="stat">
          <option value="last">Last</option>
          <option value="last10">Last 10</option>
          <option value="average">All</option>
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

export default {
  name: 'BranchHisto',
  props: {
    data: Array
  },
  data() {
    return {
      mode: 'rel',
      stat: 'last10',
    }
  },
  methods: {
    hist(field, mode, stat){
      var xs;
      if (mode == 'abs') {
        xs = this.data.map(x =>(x[field][stat] - x[field].reference))
      } else {
        xs = this.data.map(x =>(-100 * (x[field][stat] - x[field].reference)/x[field].reference))
      }
      console.log(xs);
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
    }
  },
  components: {
    Plotly
  }
}
</script>
