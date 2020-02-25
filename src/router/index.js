import Vue from 'vue'
import VueRouter from 'vue-router'
import Jobs from '../views/Jobs.vue'
import Branches from '../views/Branches.vue'
import Job from '../views/Job.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Jobs
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
    path: '/branches',
    name: 'Branches',
    component: Branches
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
