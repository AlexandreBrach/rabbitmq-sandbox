# What is this ?

This is a small sand box that provide a basic application/worker model around rabbitMQ message bus. 
The file `docker-compose` help to instanciate : 
* a `RabbitMQ` service 
* a main `NodeJS` application that push a message (a "task") every 100 miliseconds
* a `NodeJS` worker that unshift a task every one seconds (to simulate some time of work)

There's no need to provide .env, just have the tcp port 15672 available on your host.
(You can execute `launch-dev.sh` to chain docker-compose build, down and up.)
    
Once the services instanciated, you can see the messages stack growing in the `rabbitMQ` web admin at http://localhost:15672

To decrease the tasks stack, you can "scale" the `worker` service :

    docker-compose scale worker=11
 
So watch how that 11 workers unstack the avalailable tasks in the stack.

