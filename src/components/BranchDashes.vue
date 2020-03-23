<template>
<div>
    <p class="b_subtitle">Overall tests status </p>
    <b-field grouped group-multiline>
		<b-field label="Field">
			<b-select v-model="stat">
				<option value="multi">All stats</option>
				<option value="cpu_time">CPU Time</option>
				<option value="memory_avg">Memory</option>
				<option value="io_read">IO Read</option>		
			</b-select>
		</b-field>
	</b-field>
	<div class="compress">
		<b-tooltip  v-for="test in details" :key="test.test_ID" :label="test.name">
			<button :class="testClass(test)" @click="go_to_test(test)">
			</button>
		</b-tooltip>	
	</div>
	<br>
	<div class="legend">
		<b>Legend</b><br>
		<div class="sublegend compress">
			<button class="dash dleg test_failed"></button> <span class="dlabel">Test failed</span>
			<button class="dash dleg test_severe_degression"></button><span class="dlabel"> Severe degression (&lt;-8%)</span>
			<button class="dash dleg test_degression"></button><span class="dlabel"> Degression (&lt;-3%)</span>
			<button class="dash dleg test_no_change"></button><span class="dlabel"> No changes (&lt;+3%)</span>
			<button class="dash dleg test_improvement"></button><span class="dlabel"> Improvement (&lt;+8%)</span>
			<button class="dash dleg test_severe_improvement"></button><span class="dlabel"> Severe improvement(&gt;+8%)</span>
		</div>
	</div>
</div>
</template>
<script>
import router from '@/router'
import api from '@/assets/api.js';

const axios = require('axios').default;


export default {
	name: "BrachDashes",
	props: {
		branch: String
	},
	data() {
		return {
			details: undefined,
			stat: 'multi'
		}
	},
	mounted() {
		axios
			.get(api.call('api/branch', this.branch, 'details/last'))
            .then(res =>(this.details = res.data))

	},
	methods: {
		status(test) {
			if (test.result == 'FAILED' || test.result == 'CRASHED')
				return -1;
			if (this.stat == 'multi')
				return (test.cpu_time + test.memory_avg + test.io_read) / 3
			return test[this.stat];
		},
		testClass(test) {
			let baseClass = 'dash ';
			let value = this.status(test);
			if (value == -1) {
				return baseClass + 'test_failed';
			}
			let rel_value = (1 - value)*100;
			if (rel_value >= 8) {
				return baseClass + 'test_severe_improvement';
			} 
			if (rel_value > 3){
				return baseClass+ 'test_improvement';
			}
			if (rel_value >= -3) {
				return baseClass + 'test_no_change';
			}
			if (rel_value >= -8) {
				return baseClass + 'test_degression'
			} 
			return baseClass + 'test_severe_degression';
		},
		go_to_test(test){
			router.push("/job/"+test.job+"/test/"+test.test_ID+"?branch="+this.branch);
		}
	}
};
</script>
<style>
.dash{
  background-color: #4CAF50; /* Green */
  border: 1px solid rgba(0,0,0,0.2);
  color: white;
  padding: 10px 10px;
  margin: 0px;
  max-height: 12px;
  max-width: 12px;
}
.test_failed {
	background-color: #666;
}
.test_severe_degression {
	background-color: red;
}
.test_severe_improvement {
	background-color: green;
}
.test_degression{
	background-color: orange;
}
.test_improvement{
	background-color: lightgreen;
}
.test_no_change{
	background-color: yellow;
}
.b_subtitle {
	font-size: 1.25rem;
	font-weight: 400;
	line-height: 1.25;
}
.legend{
	display: inline-block;
	margin-top: 4px;
	margin-bottom: 4px;
	padding: 2px;
	vertical-align: top;

}

.dleg {
	padding: 10px 10px;
	vertical-align: middle;
}

.compress{
	margin-top: 5px;
	line-height: 10px;
	padding: 0;
}
.sublegend{
	display: inline-block;
	position:relative;
	vertical-align: middle;
}
.dlabel {
	margin-right: 30px;
	padding-top: 10px;
	font-family: Helvetica Neue, Arial, sans-serif;
	font-weight: 200;
}
</style>