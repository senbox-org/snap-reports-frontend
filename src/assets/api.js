export default {
  service: 'http://127.0.0.1:9090/',
  call() {
    let args = Array.prototype.slice.call(arguments, 0);
    return this.service+args.join('/')
  }
}
