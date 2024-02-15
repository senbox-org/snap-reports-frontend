<template>
  <div class="notification">
    <article>
      <p class="subtitle">Compare</p>
      <p class="title">{{tag_a}} <span class="vs">VS</span> <a class="change-branch" @click="select_branch()">{{tag_b}}</a></p>     
      <button v-if="!loading" class="button" style="float:right" @click="downloadCsv()" title="Download as CSV">
        <img width="32" alt=".csv icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/.csv_icon.svg/32px-.csv_icon.svg.png">
        Download
      </button>
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
          
          <span v-for="(filter, index) in filters" :key="index">
            <span class="spacer"/>
            <b-tag type="is-primary" size="is-medium" @close="removeFilter(index)" closable>
              {{filter.name}} : {{filter.value}}
            </b-tag>
          </span>
        </div>

        <b-table 
        :data="data"
        :loading="loading"
        :default-sort="['test_ID', 'asc']"
        paginated
        @click="(row) => go_to_test(row?.test_ID)"
        hoverable>
          <b-table-column field="test_ID" label="ID" sortable numeric v-slot="props">
            {{ props.row.test_ID}}
          </b-table-column>
          <b-table-column field="test_name" label="Name" sortable v-slot="props">
            {{ props.row.test_name}}<br>
          </b-table-column>
          <b-table-column field="br_a_avg" :label="tag_a" sortable numeric v-slot="props">
            {{ props.row.br_a_avg}} {{units[field]}}<br>
            <span class="lighttext">N. of executions: {{props.row.br_a_count}}</span>
          </b-table-column>
          <b-table-column field="br_b_avg" :label="tag_b" sortable numeric v-slot="props">
            {{ props.row.br_b_avg}} {{units[field]}}<br>
            <span class="lighttext">N. of executions: {{props.row.br_b_count}}</span>
          </b-table-column>
          <b-table-column field="diff_abs" label="Absolute difference" sortable numeric v-slot="props">
            {{ props.row.diff_abs.toFixed(1)}} {{units[field]}}<br>
          </b-table-column>
          <b-table-column field="diff_rel" label="Relative difference" sortable numeric v-slot="props">
            {{ props.row.diff_rel.toFixed(1)}}%<br>
          </b-table-column>
          <b-table-column field="author" label="Author" sortable v-slot="props">
            {{ props.row.author}}<br>
          </b-table-column>
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
    //   value: [],
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
            data: [],
            filters: [],
            loading: false
        };
    },
    mounted() {
        this.loading = true;
        axios
            .get(api.call('api/branch/compare', this.formatField(this.tag_a), this.formatField(this.tag_b), this.field))
            .then(({data}) => {
                this.data = data;
                this.loading = false;
            })
            .catch((err) => {
                this.data = [];
                this.loading = false;
                throw err;
            }) 
    },
    components: {
    },
    methods: {
        formatField(fieldName) {
            if (!fieldName.startsWith('snap:')) {
                return 'snap:' + fieldName;
            }
            return fieldName;
        },
        compare() {
            axios
                .get(api.call('api/branch/compare', this.formatField(this.tag_a), this.formatField(this.tag_b), this.field))
                .then((res) => {
                    this.data = [...res.data];
                    console.log('mounted', res.data);
                }); 
        },
        go_to_test(test){
            router.push("/test/"+test);
        },
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
            .get(api.call('api/branch/compare', this.formatField(this.tag_a), this.formatField(this.tag_b), fields_var))
            .then((res) => {
                this.data = [...res.data];
                console.log(res);
            });  
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
                let url = `/branch/compare/${this.formatField(this.tag_a)}/${this.formatField(value)}`;
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
      },
      downloadCsv() {
        let csv = `ID,Name,${this.tag_a},${this.tag_b},Absolute difference,Relative difference,Author\n`;
        this.data.forEach((row) => {
            csv += [row.test_ID, row.test_name, row.br_a_avg, row.br_b_avg, row.diff_abs, row.diff_rel, row.author].join(',');
            csv += "\n";
        });
    
        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = `${this.tag_a}-${this.tag_b}-${this.field}`+'.csv';
        anchor.click();
      }
    }
  }
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
