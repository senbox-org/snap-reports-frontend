const config = require('config');

export default {
<<<<<<< HEAD
  service: 'http://'+config.get('service.host')+':'+config.get('service.port'),
=======
  service: 'http://snap-report-be:9090/',
>>>>>>> 10bfa563847f07d98f34918b24c654efdce24679
  call() {
    let args = Array.prototype.slice.call(arguments, 0);
    return this.service+args.join('/')
  }
}
