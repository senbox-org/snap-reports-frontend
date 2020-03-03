<template>
  <div class="info-row">
    <b>{{ tag }}:</b> {{value}} {{unit}}<br>
  </div>
</template>
<script>
export default {
  name: 'Info',
  props:['tag', 'value', 'unit']
}
</script>
<style>
.FAILED {
  background-color: rgba(255,100,100, 0.2);
  color: rgb(150,0,0);
}
</style>
