<template>
    <form action="">
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                Select Branch
            </header>
            <section class="modal-card-body">
                <b-field >
                <b-select v-model="branch" placeholder="Select a branch">
                <option v-for="(el, index) in branches" :key="index">{{el.name}}</option>
                </b-select>
                </b-field>

            </section>
            <footer class="modal-card-foot">
                <button class="button" type="button" @click="$parent.close()">Close</button>
                <button class="button is-primary" @click="triggerEvt()">Select</button>
            </footer>
        </div>
    </form>
</template>
<script>
    const axios = require('axios').default;
    import api from '@/assets/api.js';
    export default {
    data() {
      return {
        branch: undefined,
        branches: [],
      }
    },
    mounted() {
        axios
        .get(api.call('api/branch/list'))
        .then((res) => (this.branches = res.data.branches));
    },
    methods: {
        triggerEvt() {
            this.$emit('selectBranchEvent', this.branch.substring(5));
            this.$parent.close();
        }
    }
};
</script>