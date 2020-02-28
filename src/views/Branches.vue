<template>
    <div class="tile is-ancestor">
      <div class="tile">
        <div v-for="(branch, index) in list" :key="index">
          <div v-if="blacklist.indexOf(branch.name) < 0" class="tile is-parent">
            <article class="tile is-child notification">
              <p class="subtitle">branch</p>
              <p class="title"><router-link :to="'/branch/'+branch.name.split(':')[1]">{{branch.name.split(':')[1]}}</router-link></p>
              <p class="job">
                <BranchStatus :branch="branch.name.split(':')[1]"/>
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import BranchStatus from '@/components/BranchStatus.vue'

const axios = require('axios').default;

export default {
  name: 'branches',
  data() {
    return {
      blacklist: [
        'snap:testAuxdataV2',
        'snap:randomSeed'
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
      .get("http://localhost:9090/api/branch/list")
      .then(function(res){
        obj.list = res.data.branches;
      });
  }
}
</script>
<style scoped>
.branches {
  margin: 0;
  padding: 0;
}
</style>
