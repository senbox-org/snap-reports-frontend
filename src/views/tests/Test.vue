<template>
  <div class="notification">
    <article>
      <p class="subtitle">Test Set: {{test.testset}}</p>
      <p class="title">{{test.name}} (#{{test.ID}})</p>
      <div class="test_desc_inline trsp_bg  trsp_bord"> 
        <Info tag="Author" :value="test.author"/>
        <Info tag="Frequency" :value="test.frequency"/>
        <Info tag="Description" :value="test.description"/>
        <Info tag="Graph path" :value="test.graphPath"/><br>
        <Info tag="Number of executions" :value="count"/>
        <b>Last execution:</b> <br>
        <span class="indent lighttext">Job: <router-link :to="'/job/'+last_job.ID">#{{last_job.ID}}</router-link></span><br>
        <span class="indent lighttext">Date: {{last_job.timestamp_start}}</span><br>
        <span class="indent lighttext">Execution summary: <router-link :to="'/job/'+last_job.ID+'/test/'+test.ID+'?branch='">#{{last_job.ID}}/{{test.ID}}</router-link></span>
      </div>
      <div class="test_desc_inline trsp_bg">
          <network ref="network"
          :nodes="nodes"
          :edges="edges"
          :options="options">
          </network>
      </div><br class="test_desc_clearBoth">
      <b-tabs>
        <b-tab-item label="Overview">
          <TestOverview :test="id"/>
        </b-tab-item>
        <b-tab-item label="History">
          <TestHistory :test="id"/>
        </b-tab-item>
        <b-tab-item label="Histogram">
          <TestHisto :test="id"/>
        </b-tab-item>
      </b-tabs>
    </article>
  </div>
</template>
<script>
import api from '@/assets/api.js';
import Info from '@/components/Info.vue';
import TestOverview from '@/components/TestOverview.vue';
import TestHistory from '@/components/TestHistory.vue';
import TestHisto from '@/components/TestHisto.vue';
import { Network } from "vue-vis-network";

const parseString = require('xml2js').parseString;
const axios = require('axios').default;

export default {
  name: 'Test',
  data() {
    return {
      id: this.$route.params.id,
      test: {},
      count: 0,
      last_job: {},
      nodes: [],
      edges: [],
      options: {
        layout: {
          hierarchical: {
            enabled: true,
            direction: "LR",
            nodeSpacing: 30,
            treeSpacing: 30,
            levelSeparation: 150,
          }
        },
        nodes: {
          borderWidth: 1,
          color: '#333',
          font: {
            color: 'white'
          },
          shape: 'box'
        },
        edges: {
          color: 'gray',
          arrows: {
            to :{
              enabled: true,
              type: 'arrow'
            }
          }
        }
      }
    }
  },
  mounted() {
    axios
      .get(api.call('api/test', this.id))
      .then((res) => (this.test = res.data));
    axios
      .get(api.call('api/test', this.id, 'count'))
      .then((res) => (this.count = res.data.count));
    axios
      .get(api.call('api/test', this.id, 'last_job'))
      .then((res) => (this.last_job = res.data));
    axios
      .get(api.call('api/test', this.id, 'graph.xml'))
      .then((res) => (this.parse(res.data)));
  },
  methods: {
    parse(xml) {
      let parent = this;
      parseString(xml, function (err, result) {
        result.graph.node.forEach (function (node){
          let id = node.$.id;
          parent.nodes.push({
            id: id,
            label: id 
          })
          node.sources.forEach(function(source){
            if (source && 'sourceProduct' in source)
              parent.edges.push({
                from: source.sourceProduct[0].$.refid,
                to: id,
              });
          });
        });
      });
    }
  },
  components: {
    Info,
    TestOverview,
    TestHistory,
    TestHisto,
    Network
  }
};
</script>
<style>
div.test_desc_inline { float:left; width: 49%;}
.test_desc_clearBoth { clear:both; }
.trsp_bg {
  background: rgba(0,0,0,0);
}
.trsp_bord {
  border-color: rgba(0,0,0,0);
}
</style>