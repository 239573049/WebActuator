# WebActuator Web

## 1. 项目介绍

   WebActuator Web是一个基于React的前端项目，主要用于WebActuator的前端展示，提供了一个可视化的界面，方便用户使用WebActuator。
   WebActuator 是.NET封装的简易编译，执行封装工具。WebActuator Web则是调用了WebActuator的`js`Api，从而实现了WebActuator的可视化界面。


## 2. 项目结构

```
WebActuatorWeb
├── src
│   ├── layout     // 布局
│   ├── pages      // 页面
│   ├── components // 组件
│   ├── services   // 服务
│   ├── utils      // 工具
│   └── types      // 类型
```

## 发布

```bash
npm run build
```

将`dist`下所有文件复制到`Examples.Service`项目下面的wwwroot下面，然后启动项目即可，部署的时候将`Examples.Service`项目部署到服务器即可。

