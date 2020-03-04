export default {
  service: 'http://snap-build-server.tilaa.cloud:9090/',
  call() {
    let args = Array.prototype.slice.call(arguments, 0);
    return this.service+args.join('/')
  }
}
