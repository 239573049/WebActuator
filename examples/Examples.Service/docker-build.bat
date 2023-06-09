cd ../../
docker build -t registry.cn-shenzhen.aliyuncs.com/gotrays/web-actuator-service -f examples\Examples.Service\Dockerfile .
docker push registry.cn-shenzhen.aliyuncs.com/gotrays/web-actuator-service