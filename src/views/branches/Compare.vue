<template>
  <div class="notification">
    <article>
      <p class="subtitle">Compare</p>
      <p class="title">{{tag_a}} <span class="vs">VS</span> <a class="change-branch" @click="select_branch()">{{tag_b}}</a></p>     
      
        <b-field label="Statistics">
        <b-select v-model="field" @input="update">
            <option value="duration">Duration</option>
            <option value="cpu_time">CPU time</option>
            <option value="memory_avg">Memory</option>
            <option value="memory_max">Memory</option>
            <option value="io_read">IO Read</option>
            <option value="io_write">IO Write</option>
          </b-select>
        </b-field><br>
        <div class="block"> 
          <b>Filters</b>
          <span class='spacer'/>

          <b-button @click="add_filter()">+</b-button>
          
          <span  v-for="(filter, index) in filters" :key="index">
            <span class="spacer"/>
            <b-tag type="is-primary" size="is-medium" @close="removeFilter(index)" closable>
              {{filter.name}} : {{filter.value}}
            </b-tag>
          </span>
        </div>

      <b-table
      :data="value"
      :default-sort="['test_ID', 'asc']"
      hoverable>
        <template slot-scope="props">
          <b-table-column field="test_ID" label="ID" sortable numeric>
            {{ props.row.test_ID}}
          </b-table-column>
          <b-table-column field="test_name" label="Name" sortable>
            {{ props.row.test_name}}<br>
          </b-table-column>
          <b-table-column field="br_a_avg" :label="tag_a" sortable numeric>
            {{ props.row.br_a_avg}} {{units[field]}}<br>
            <span class="lighttext">N. of executions: {{props.row.br_a_count}}</span>
          </b-table-column>
          <b-table-column field="br_b_avg" :label="tag_b" sortable numeric>
            {{ props.row.br_b_avg}} {{units[field]}}<br>
            <span class="lighttext">N. of executions: {{props.row.br_b_count}}</span>
          </b-table-column>
          <b-table-column field="diff_abs" label="Absolute difference" sortable numeric>
            {{ props.row.diff_abs.toFixed(1)}} {{units[field]}}<br>
          </b-table-column>
          <b-table-column field="diff_rel" label="Relative difference" sortable numeric>
            {{ props.row.diff_rel.toFixed(1)}}%<br>
          </b-table-column>
        </template>
      </b-table>
    </article>
  </div>
</template>
<script>
  import FilterForm from '@/components/FilterForm.vue';
  import BranchList from '@/components/BranchList.vue';
  import router from '@/router'


  const axios = require('axios').default;
  import api from '@/assets/api.js';

  export default {
    data() {
      return {
        tag_a: this.$route.params.tag_a,
        tag_b: this.$route.params.tag_b,
        addFilterActive: false,
        field: 'duration',
        units: {
          duration: 's',
          cpu_time: 's',
          memory_avg: 'MB',
          memory_max: 'MB',
          io_write: '',
          io_read: '',
        },
        value: [],
        filters: [],
      }
    },
    mounted() {
      axios
        .get(api.call('api/branch/compare', this.tag_a, this.tag_b, this.field))
        .then((res) => (this.value = res['data']));
    },
    components: {

    },
    methods: {
      update(){
        let fields_var = this.field;
        if (this.filters.length) {
          fields_var += '?';
        }
        for (let i=0; i < this.filters.length; i++) {
          if (i > 0) {
            fields_var += '&';
          }
          let filter = this.filters[i];
          fields_var += filter.name + '=' + filter.value;
        }
        axios
        .get(api.call('api/branch/compare', this.tag_a, this.tag_b, fields_var))
        .then((res) => (this.value = res['data']));  
      },
      add_filter(){
        this.$buefy.modal.open({
                    parent: this,
                    component: FilterForm,
                    hasModalCard: true,
                    trapFocus: true,
                    events: {
                      'addFilterEvent': value => {
                        this.filters.push(value)
                        this.update()
                      }
                    }
              })
      },
      select_branch() {
        this.$buefy.modal.open({
            parent: this,
            component: BranchList,
            hasModalCard: true,
            trapFocus: true,
            events: {
              'selectBranchEvent': value => {
                let url = "/branch/compare/"+this.tag_a+'/'+value;
                router.replace({path: url});
                this.tag_b = value;
                this.update();
              }
            }
        })
      },
      removeFilter(index){
        this.filters.splice(index, 1);
        this.update()
      }
    }
  };
</script>
<style>
.vs {
  font-style: normal;
  font-weight: lighter;
  color: #aaa;
}

.change-branch {
  border: dashed 1px #333;
  padding: 4px;
}

.spacer {
  margin: 5px;
}
</style>
