# snap-reports

## Project setup

```
npm install
```

or `docker built . -t snap-reports-frontend:latest`

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Deploy to k8s

```sh
kubectl apply -f manifests/deployment.yaml -n snap-report
kubectl apply -f manifests/service.yaml -n snap-report
kubectl apply -f manifests/ingress.yaml -n snap-report
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## TODO

* Migrate to Vuejs v3