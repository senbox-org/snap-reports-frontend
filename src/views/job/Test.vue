<template>
    <div class="notification">
    <b-loading v-model="loading"></b-loading>
    <article v-if="data != undefined">
      <p class="subtitle">job <router-link :to="'/job/'+job">#{{job}}</router-link> <br> execution #{{data.ID}}</p>
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
      <b>Branch:</b> <router-link :to="'/branch/'+branch">{{branch}}</router-link><br>
      <br>
      ref: {{ [reference] }}
      local ref: {{ [local_reference] }}
      <b-tabs cards>
      <b-tab-item label="Summary">
        <b-table :data="fields" hoverable :loading="loading">
            <b-table-column label="Field" v-slot="props">
              {{props.row?.tag}}
            </b-table-column>
            <b-table-column v-slot="props" label="Recorded" numeric>
              {{data[props.row.field]}} {{props.row.unit}}
            </b-table-column>
            <b-table-column v-slot="props" v-if="reference != null" label="Reference" numeric>
              <p v-if="props.row">
                <b-tag size="is-medium" :type="get_type(data[props.row.field], reference[props.row.field])">
                  {{reference[props.row.field]?.toFixed(1)}} {{props.row.unit}}
                </b-tag>
              </p>
              <div v-if="props.row" :class="'subtext '+get_class(data[props.row.field], reference[props.row.field])">
                {{(data[props.row.field] - reference[props.row.field])?.toFixed(1)}} {{props.row.unit}}<br>
                {{data[props.row.field] > reference[props.row.field] ? '+' : ''}}{{((data[props.row.field] / reference[props.row.field] - 1) * 100).toFixed(1)}} %
              </div>
            </b-table-column>
            <b-table-column v-slot="props" v-if="local_reference" label="Branch Average" numeric>
              <p v-if="local_reference[props.row.field]">
                <b-tag size="is-medium" :type="get_type(data[props.row.field], local_reference[props.row.field].average)">
                  {{local_reference[props.row.field].average.toFixed(1)}} {{props.row.unit}} <span class='lighttext'>(std: {{local_reference[props.row.field].std.toFixed(1)}} {{props.row.unit}})</span>
                </b-tag>
              </p>
              <div v-if="local_reference[props.row.field]" :class="'subtext '+get_class(data[props.row.field], local_reference[props.row.field].average)">
                {{(data[props.row.field] - local_reference[props.row.field].average).toFixed(1)}} {{props.row.unit}}<br>
                {{data[props.row.field] > local_reference[props.row.field].average ? '+' : ''}}{{((data[props.row.field] / local_reference[props.row.field].average - 1) * 100).toFixed(1)}} %
              </div>
            </b-table-column>
        </b-table>
      </b-tab-item>
      <b-tab-item v-if="data.output != ''" label="Output">
        <code class="gpt_output" v-html="output()"></code>
      </b-tab-item>
      <b-tab-item label="Profile">
        <div>
          <Plotly :data="profiles()" :layout="layout" :display-mode-bar="false"/>
          <p class="v-gap">
            <b-tag type="is-white"><b>Note: </b> the IO Read counter Y axis is hidden to avoid confusion.</b-tag>
          </p>
        </div>
      </b-tab-item>
      <b-tab-item label="Histograms">
        <div>
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
        </div>
        <p class="v-gap">
          <b-tag type="is-white"><b>Note: </b> the expected distribution is computed using mean and standard deviation of the current branch.</b-tag>
        </p>
      </b-tab-item>
    </b-tabs>

    </article>
  </div>
</template>
<script>
  import { Plotly } from 'vue-plotly'

  import Info from '@/components/Info.vue';

  import api from '@/assets/api.js'

  const axios = require('axios').default;


  export default {
    name: 'JobTest',
    data() {
      let test_id = this.$route.params.test;
      let job_id = this.$route.params.job;
      return {
        id: test_id,
        job: job_id,
        data: undefined,
        reference: undefined,
        local_reference: undefined,
        summary: {},
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
            title: 'CPU usage (%)',
            side: 'left'
          },
          yaxis2: {
            title: 'Memory (Mb)',
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
        ref_marker: {
          color: 'LightGreen',
          size: 12,
          line: {
              color: 'MediumGreen',
              width: 2
          }
        },
        std_line: {
          color: '#333',
          width: 1,
          dash: 'dot',
        },
        loading: false
      }
    },
    mounted() {
      this.loading = true;
      axios
        .get(api.call("api/job", this.job, "statistics", this.id))
        .then((res) => {
            this.data = res.data;
            for (const field of this.fields) {
                this.summary[field.field] = this.data[field.field];
            }
            this.loading = false
        })
        .catch((err) => {
            this.loading = false;
            this.data = {};
            console.error(err);
        });
      axios
        .get(api.call("api/test", this.id, "reference"))
        .then((res) => (this.reference = res.data))
        .catch((err) => {
            this.reference = {};
            this.loading = false;
            console.error(err.response.data);
        });
      axios
        .get(api.call("api/test", this.id, "summary", this.branch))
        .then((res) => (this.local_reference = res.data))
        .catch((err) => {
            console.error(err.response.data);
        });
      axios
        .get(api.call("api/test", this.id, "history/cpu_time", this.branch))
        .then((res) => (this.history.cpu_time = res.data))
        .catch((err) => {
            this.loading = false;
            console.error(err.response.data);
        });
      axios
        .get(api.call("api/test", this.id, "history/memory_avg", this.branch))
        .then((res) => (this.history.memory_avg = res.data))
        .catch((err) => {
            this.loading = false;
            console.error(err.response.data);
        });
      axios
        .get(api.call("api/test", this.id, "history/duration", this.branch))
        .then((res) => (this.history.duration = res.data))
        .catch((err) => {
            this.loading = false;
            console.error(err.response.data);
        });
      axios
        .get(api.call("api/test", this.id, "history/io_read", this.branch))
        .then((res) => (this.history.io_read = res.data))
        .catch((err) => {
            this.loading = false;
            console.error(err.response.data);
        });
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
        let xs = [];
        let ys = [];
        let delta = (max - min) / 30;
        for (let x = min; x <= max; x += delta) {
          xs.push(x);
          let y = norm * this.gfx(mu, std, x);
          ys.push(y);
        }
        return [xs, ys];
      },
      get_class(value, reference) {
        if (value === undefined) {
            return undefined;
        }
        if (value > reference) {
          return 'failed_text';
        } else if (value < reference) {
          return 'success_text';
        }
        return undefined;
      },
      get_type(value, reference) {
        if (value === undefined) {
            return undefined;
        }
        if (value < reference) {
          return 'is-success'
        }
        if (value > reference) {
          return 'is-danger'
        }
        return undefined;
      },
      profiles() {
        let time = [];
        let cpu = [];
        let read = [];
        let memory = [];
        for (let i = 1; i < this.data.raw_data.length; i++) {
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
      output() {
        return this.data.output.split("\n").join("<br>")
      },
      hist(field) {
        if (this.history[field] == undefined || this.local_reference == undefined) {
          return [];
        }

        let xs = this.history[field].value;
        // define xscale
        let xmin = Math.min(...xs);
        let xmax = Math.max(...xs);
        let delta = (xmax - xmin) / 15;
        xmin -= delta;
        xmax += delta;
        // compute distribution
        let nbins = 15;
        let mu = this.local_reference[field].average;
        let std = this.local_reference[field].std;
        let norm = xs.length * (xmax - xmin) / nbins;

        let stddist = this.gauss(mu, std, xmin, xmax, norm);

        let res = [{
          x: stddist[0],
          y: stddist[1],
          name: 'Expected distribution'
        }];
        for (let i = 0; i <= 2; i++) {
          if (i == 0) {
            res.push({
              showlegend: false,
              line: this.std_line,
              x: [mu, mu],
              y: [0, norm * this.gfx(mu, std, mu)]
            });
          } else {
            let x = mu + i * std;
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
        if (this.reference != null){
          res.push(
            {
              x: [this.reference[field]],
              y: [0],
              name: "Reference value",
              type: "scatter",
              marker: this.ref_marker
            }
          )
        }
        return res;
      }
    },
    props: {
      branch: String
    }
  };
</script>
<style>
.bm_xs {
  padding-bottom: 1em;
}
.subtext {
  font-size: 10pt;
}

.lighttext {
  font-weight: 300;
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
  margin-bottom: 0.5em;
  padding-right: 0.5em ;
}

.v-gap {
  margin-top: 0.5em;
}

.notification .gpt_output {
  background: transparent;
  color: #333;
}
</style>
