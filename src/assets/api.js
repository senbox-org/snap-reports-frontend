export default {
  service: process.env.VUE_APP_HOST,
  call() {
    let args = Array.prototype.slice.call(arguments, 0);
    return this.service+args.join('/')
  }
}
