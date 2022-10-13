# jslogo as a service

This is a simple Express.js wrapper of [jslogo](https://github.com/kburnik/jslogo) to provide LOGO-as-a-Service

It is optimized for Tencent SCF as a stateless cloud function docker container.

The current implementation is in quick-and-dirty style, a lot of procedure is just run as shell command by `execSync`.

Deployment enviroment is Debian 10 with GraphicsMagick and Wget installed.