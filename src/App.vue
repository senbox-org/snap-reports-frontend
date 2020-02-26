<template>
  <div id="app" class="app">
    <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
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
        </template>
        <template slot="end">
          <b-navbar-item  tag="router-link" :to="{ path:'/about'}">
              About
          </b-navbar-item>
        </template>
    </b-navbar>
    <router-view/>
  </div>
</template>

<style>

</style>
