import Vue from 'vue'
import VueRouter from 'vue-router'
import Jobs from '../views/Jobs.vue'
import Branches from '../views/Branches.vue'
import Job from '../views/Job.vue'
import JobTest from '../views/job/Test.vue'
import Home from '../views/Home.vue'
import Tests from '../views/Tests.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: Jobs
  },
  {
    path: '/job/:id(\\d+)',
    name: 'Job',
    component: Job
  },
  {
    path: '/job/:id(\\d+)/test/:test(\\d+)',
    name: 'JobTest',
    component: JobTest,
    props: (route) => ({ branch: route.query.branch })
  },
  {
    path: '/branches',
    name: 'Branches',
    component: Branches
  },
  {
    path: '/tests',
    name: 'Tests',
    component: Tests
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
