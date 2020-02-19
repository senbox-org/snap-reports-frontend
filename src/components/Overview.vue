<template>
  <div class="hello">
    <div class="log">Log: {{ log }}</div>
  </div>
</template>

<script>
const nSQL = require('@nano-sql/core').nSQL;

export default {
  name: 'Overview',
  data () {
    noSQL().createDatabase({
      id: "simpleDB",
      mode: "TEMP",
      tables: [
        {
          name: "users",
          model: {
            // pk == primary key, ai == auto incriment,
            "id:int": {pk: true, ai: true},
            "name:string": {},
            "age:int":{}
          }
        }
      ]
    })
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
