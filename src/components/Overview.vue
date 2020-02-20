<template>
  <div class="overview">
    <div class="log">Log: {{ log }}</div>
  </div>
</template>

<script>
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("../assets/reportDB.db");
console.log(db);

export default {
  name: 'Overview',
  data () {
    return {
      log: undefined
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.log {
  padding: 2px 4px 2px 4px;
  margin: 0 5% 0 5%;
  width: 90%;
  background-color: #eee;
  text-align: left;
  font-size: 10pt;
  font-style: italic;
}

a {
  color: #42b983;
}
</style>
