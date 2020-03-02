<template>
  <div class="notification">
    <article>
      <p class="subtitle">job <a @click="back()">#{{job}}</a> <br> execution #{{data.ID}}</p>
      <p class="title">{{data.test.name}} (<router-link :to="`/test/${data.test.ID}`">#{{data.test.ID}}</router-link>)</p>
      <p class="subtitle">result: <b :class="data.result.tag">{{data.result.tag}}</b></p>
      <b>Description</b><br>
      <p class="bm-xs">
        {{data.test.description}}
      </p>
      <Info tag="Author" :value="data.test.author"/>
      <Info tag="Frequency" :value="data.test.frequency"/>
      <Info tag="Graph" :value="data.test.graphPath"/>
      <Info tag="Start" :value="data.start"/>
      <Info tag="Branch" :value="branch" />
      <br>
      <b-tabs cards>
      <b-tab-item label="Summary">
        <b-table
          :data="fields"
          hoverable
        >
          <template slot-scope="props">
            <b-table-column label="Field">
              {{props.row.tag}}
            </b-table-column>
            <b-table-column  label="Recorded" numeric>
              {{data[props.row.field]}} {{props.row.unit}}
            </b-table-column>
            <b-table-column v-if="reference != null" label="Reference" numeric>
              <p >
                <b-tag size="is-medium" :type="get_type(data[props.row.field], reference[props.row.field])">
                  {{reference[props.row.field].toFixed(1)}} {{props.row.unit}}
                </b-tag>
              </p>
              <div :class="'subtext '+get_class(data[props.row.field], reference[props.row.field])">
                {{(data[props.row.field] - reference[props.row.field]).toFixed(1)}} {{props.row.unit}}<br>
                {{data[props.row.field] > reference[props.row.field] ? '+' : ''}}{{((data[props.row.field] / reference[props.row.field] - 1) * 100).toFixed(1)}} %
              </div>
            </b-table-column>
            <b-table-column v-if="local_reference != null" label="Branch Average" numeric>
              <p >
                <b-tag size="is-medium" :type="get_type(data[props.row.field], local_reference[props.row.field].average)">
                  {{local_reference[props.row.field].average.toFixed(1)}} {{props.row.unit}}
                </b-tag>
              </p>
              <div :class="'subtext '+get_class(data[props.row.field], local_reference[props.row.field].average)">
                {{(data[props.row.field] - local_reference[props.row.field].average).toFixed(1)}} {{props.row.unit}} - STD: {{local_reference[props.row.field].std.toFixed(1)}} {{props.row.unit}}<br>
                {{data[props.row.field] > local_reference[props.row.field].average ? '+' : ''}}{{((data[props.row.field] / local_reference[props.row.field].average - 1) * 100).toFixed(1)}} %
              </div>
            </b-table-column>
          </template>
        </b-table>
      </b-tab-item>
      <b-tab-item label="Profile">
        <div>
          <Plotly :data="profiles()" :layout="layout" :display-mode-bar="false"/>
        </div>
      </b-tab-item>
      <b-tab-item label="Histograms">
        <div class="hw">
          <Plotly
            :data="hist('duration')"
            :display-mode-bar="false"
            :layout="{
              title: 'Duration - distribution',
              yaxis: {
                title: '# exectuions'
              },
              xaxis: {
                title: 'Time (s)'
              }
            }"
          />
        </div>
        <div class="hw">
          <Plotly
            :data="hist('cpu_time')"
            :display-mode-bar="false"
            :layout="{
              title: 'CPU Time - distribution',
              yaxis: {
                title: '# exectuions'
              },
              xaxis: {
                title: 'Time (s)'
              }
            }"
          />
        </div>
        <br>
        <div class="hw">
          <Plotly
            :data="hist('memory_avg')"
            :display-mode-bar="false"
            :layout="{
              title: 'Memory average - distribution',
              yaxis: {
                title: '# exectuions'
              },
              xaxis: {
                title: 'Memory (Mb)'
              }
            }"
          />
        </div>
        <div class="hw">
          <Plotly
            :data="hist('io_read')"
            :display-mode-bar="false"
            :layout="{
              title: 'IO Read - distribution',
              yaxis: {
                title: '# exectuions'
              },
              xaxis: {
                title: 'IO Counter (#)'
              }
            }"
          />
        </div>
      </b-tab-item>
    </b-tabs>

    </article>
  </div>
</template>
<script>
  import { Plotly } from 'vue-plotly'

  import Info from '@/components/Info.vue';
  import router from '@/router'

  import api from '@/assets/api.js'

  const axios = require('axios').default;


  export default {
    name: 'JobTest',
    data() {
      var url = this.$route.fullPath;
      var test_id = url.split('/')[4].split('?')[0];
      var job_id = url.split('/')[2];
      return {
        id: test_id,
        job: job_id,
        url: url,
        data: undefined,
        reference: undefined,
        local_reference: undefined,
        history: {
          duration: undefined,
          cpu_time: undefined,
          memory_avg: undefined,
          io_read: undefined,
        },
        fields: [
          {
            field: 'duration',
            tag: 'Duration',
            unit: 's'
          },
          {
            field: 'cpu_time',
            tag: 'CPU Time',
            unit: 's'
          },
          {
            field: 'memory_avg',
            tag: 'Memory',
            unit: 'Mb'
          },
          {
            field: 'io_read',
            tag: 'IO Read',
            unit: 'b'
          }
        ],
        options: {
          autosizable: true,
          responsive: true,
          displaylogo: false,
          displayModeBar: false
        },
        layout: {
          yaxis: {
            title: '%',
            side: 'left'
          },
          yaxis2: {
            title: 'Mb',
            overlaying: 'y',
            side: 'right'
          },
          yaxis3: {
            title: '',
            overlaying: 'y',
            side: 'right',
            visible: false
          },
          xaxis: {
            title: 'time (s)'
          }
        },
        marker: {
          color: 'LightSkyBlue',
          size: 12,
          line: {
              color: 'MediumPurple',
              width: 2
          }
        },
        std_line: {
          color: '#333',
          width: 1,
          dash: 'dot',
        }
      }
    },
    mounted() {
      axios
        .get(api.call("api/job", this.job, "statistics", this.id))
        .then((res) => (this.data = res.data));
      axios
        .get(api.call("api/test", this.id, "reference"))
        .then((res) => (this.reference = res.data));
      axios
        .get(api.call("api/test", this.id, "summary", this.branch))
        .then((res) => (this.local_reference = res.data))
      axios
        .get(api.call("api/test", this.id, "history/cpu_time", this.branch))
        .then((res) => (this.history.cpu_time = res.data));
      axios
        .get(api.call("api/test", this.id, "history/memory_avg", this.branch))
        .then((res) => (this.history.memory_avg = res.data));
      axios
        .get(api.call("api/test", this.id, "history/duration", this.branch))
        .then((res) => (this.history.duration = res.data));
      axios
        .get(api.call("api/test", this.id, "history/io_read", this.branch))
        .then((res) => (this.history.io_read = res.data));
    },
    components: {
      Info,
      Plotly
    },
    methods: {
      gfx(mu, std, x) {
        return 1 / (std * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * Math.pow((x - mu)/std, 2));
      },

      gauss(mu, std, min, max, norm) {
        var xs = [];
        var ys = [];
        let delta = (max - min) / 30;
        for (var x = min; x <= max; x += delta) {
          xs.push(x);
          let y = norm * this.gfx(mu, std, x);
          ys.push(y);
        }
        return [xs, ys];
      },
      get_class(value, reference) {
        if (value > reference) {
          return 'failed_text';
        } else if (value < reference) {
          return 'success_text';
        }
        return undefined;
      },
      get_type(value, reference) {
        if (value < reference) {
          return 'is-success'
        }
        if (value > reference) {
          return 'is-danger'
        }
        return undefined;
      },
      back() {
        router.back();
      },
      profiles() {
        var time = [];
        var cpu = [];
        var read = [];
        var memory = [];
        for (var i = 1; i < this.data.raw_data.length; i++) {
          time.push(this.data.raw_data[i][0] / 1000);
          cpu.push(this.data.raw_data[i][3]);
          read.push(this.data.raw_data[i][5]);
          memory.push(this.data.raw_data[i][1]);

        }
        // let norm = Math.max(...memory) / Math.max(...read);
        return [
          {
            x: time,
            y: cpu,
            name: "CPU Usage"
          },
          {
            x: time,
            y: memory,
            yaxis: "y2",
            name: 'Memory'
          },
          {
            x: time,
            y: read, //read.map((val) => (val * norm)),
            yaxis: "y3",
            name: "IO Read"
          }
        ]
      },
      hist(field) {
        if (this.history[field] == undefined) {
          return [];
        }

        var xs = this.history[field].value;
        // define xscale
        var xmin = Math.min(...xs);
        var xmax = Math.max(...xs);
        let delta = (xmax - xmin) / 15;
        xmin -= delta;
        xmax += delta;
        // compute distribution
        let nbins = 15;
        let mu = this.local_reference[field].average;
        let std = this.local_reference[field].std;
        let norm = xs.length * (xmax - xmin) / nbins;

        var stddist = this.gauss(mu, std, xmin, xmax, norm);

        var res = [{
          x: stddist[0],
          y: stddist[1],
          name: 'Expected distribution'
        }];
        for (var i = 0; i <= 2; i++) {
          if (i == 0) {
            res.push({
              showlegend: false,
              line: this.std_line,
              x: [mu, mu],
              y: [0, norm * this.gfx(mu, std, mu)]
            });
          } else {
            var x = mu + i * std;
            if (x < xmax) {
              res.push({
                showlegend: false,
                line: this.std_line,
                x: [x, x],
                y: [0, norm * this.gfx(mu, std, x)]
              });
            }
            x = mu - i * std;
            if (x > xmin) {
              res.push({
                showlegend: false,
                line: this.std_line,
                x: [x, x],
                y: [0, norm * this.gfx(mu, std, x)]
              });
            }
          }
        }

        res = res.concat([
          {
            x: xs,
            marker: {
              color: "rgba(255, 100, 102, 0.7)",
               line: {
                color:  "rgba(255, 100, 102, 1)",
                width: 1
              },
            },
            type: 'histogram',
            name: "Historic values",
            autobinx: false,
            xbins: {
              start: xmin,
              end: xmax,
              size: (xmax - xmin) / nbins
            }
          },
          {
            x: [this.data[field]],
            y: [0],
            name: "Recorded value",
            type: "scatter",
            marker: this.marker
          }
        ]);
        return res;
      }
    },
    props: {
      branch: String
    }
  }
</script>
<style>
.bm_xs {
  padding-bottom: 1em;
}
.subtext {
  font-size: 10pt;
}

.failed_text {
  color: #ff3860;
  font-weight: 500;
}

.success_text {
  color: #23d160;
  font-weight: 500;
}

.wbg {
  background-color: #fff;
}
.object {
  background-color: #ddd;
  width: 94%;
  margin-left: 3%;
  margin-right: 3%;
  height: 600px;
}

.hw {
  width: 50%;
  margin: auto;
  float: left;
  padding: 0;
}
</style>
