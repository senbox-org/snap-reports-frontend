<template>
	<form action="">
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">Add Filter</p>
			</header>
			<section class="modal-card-body">
				<b-field label="Filter Type">
					<b-select v-model="filter_type" placeholder="Select a filter">
						<option value="author">Author</option>
						<option value="description">Description</option>
						<option value="frequency">Frequency</option>
					</b-select>
				</b-field>

				<b-field label="Value">
					<b-input
					type="text"
					v-model="filter_val"
					placeholder="value"
					required>
					</b-input>
				</b-field>
			</section>
			<footer class="modal-card-foot">
			<button class="button" type="button" @click="$parent.close()">Close</button>
			<button class="button is-primary" @click="triggerEvt()">Add</button>
			</footer>
		</div>
	</form>
</template>
<script>
export default {
    data() {
      return {
        filter_type: undefined,
        filter_val: undefined,
      }
    },
	methods: {
		triggerEvt() {
			console.log(this.filter_val)
			this.$emit('addFilterEvent', {name:this.filter_type, value: this.filter_val});
			this.$parent.close();
		}
	}
};
</script>