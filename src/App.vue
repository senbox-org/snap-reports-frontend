<template>
  <div id="app">
    <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/jobs' }">
                <img
                    src="http://step.esa.int/main/wp-content/uploads/2015/11/snap_survey_125.jpg"
                    alt="SNAP"
                >
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item tag="router-link" :to="{ path:'/jobs'}">
                Jobs
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path:'/branches'}">
                Branches
            </b-navbar-item>
            <b-navbar-item  tag="router-link" :to="{ path:'/about'}">
                About
            </b-navbar-item>

        </template>
    </b-navbar>

    <router-view/>
  </div>
</template>

<style>


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
  margin: 0;
}

.title {
  color: #124350;
}

#nav {
  padding-bottom: 30px;
  padding-top: 0px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
