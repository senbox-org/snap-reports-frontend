export default {
  service: 'http://snap-report-be:9090/',
  call() {
    let args = Array.prototype.slice.call(arguments, 0);
    return this.service+args.join('/')
  }
}
