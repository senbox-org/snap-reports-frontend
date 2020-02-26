<template>
  <div class="info-row">
    <b>{{ tag }}:</b> {{value}}<br>
  </div>
</template>
<script>
export default {
  name: 'Info',
  props:{
    tag: String,
    value: Object
  },
}
</script>
<style>
.FAILED {
  background-color: rgba(255,100,100, 0.2);
  color: rgb(150,0,0);
}
</style>
