<template>
  <div id="app" class="app">
    <b-navbar>
        <template v-slot:brand>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img
                    src="https://step.esa.int/main/wp-content/uploads/2015/11/snap_survey_125.jpg"
                    alt="SNAP"
                >
            </b-navbar-item>
        </template>
        <template v-slot:start>
            <b-navbar-item tag="router-link" :to="{ path:'/jobs'}">
                Jobs
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path:'/branches'}">
                Branches
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path:'/tests'}">
                Tests
            </b-navbar-item>
        </template>
        <template v-slot:end>
          <b-navbar-item  tag="router-link" :to="{ path:'/about'}">
              About
          </b-navbar-item>
        </template>
    </b-navbar>
    <div class="mainview">
      <router-view/>
    </div>
  </div>
</template>

<style>
.mainview {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
