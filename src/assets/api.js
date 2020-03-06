const config = require('config');

export default {
  service: 'http://'+config.get('service.host')+':'+config.get('service.port'),
  call() {
    let args = Array.prototype.slice.call(arguments, 0);
    return this.service+args.join('/')
  }
}
