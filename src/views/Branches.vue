<template>
    <div class="branch_container">
      <span v-for="(branch, index) in list" :key="index" >
        <article v-if="blacklist.indexOf(branch.name) < 0" class="branch notification">
          <p class="subtitle">branch</p>
          <p class="title"><router-link :to="'/branch/'+branch.name">{{branch.name}}</router-link></p>
          <p class="job">
            <BranchStatus :branch="branch.name"/>
          </p>
        </article>
      </span>
    </div>
</template>

<script>
import BranchStatus from '@/components/BranchStatus.vue'
import api from '@/assets/api.js';

const axios = require('axios').default;

export default {
  name: 'branches',
  data() {
    return {
      blacklist: [
        'snap:testAuxdataV2',
        'snap:randomSeed',
        'snap:testAuxdata'
      ],
      list: undefined,
    }
  },
  components: {
    BranchStatus
  },
  mounted() {
    var obj = this;
    axios
      .get(api.call("api/branch/list"))
      .then(function(res){
        obj.list = res.data.branches;
      });
  }
};
</script>
<style scoped>
.branches {
  margin: 0;
  padding: 0;
}
.branch_container {
  padding: 5px;
}
.branch {
  width: 250pt;
  float:left;
  margin: 5px;
  display: inline-block;
}
</style>
