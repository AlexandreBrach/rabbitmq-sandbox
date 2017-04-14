# What is this ?

This is a small sand box that provide a basic application/worker model around rabbitMQ message bus. 
The file `docker-compose` help to instanciate : 
* a `RabbitMQ` service 
* a main `NodeJS` application that push a message every 100 miliseconds on it
* a `NodeJS` worker that unshift a message every seconds

There's no need to provide .env, just have the tcp port 15672 available on your host.
    
Once the services instanciated, you can see the messages stack growing in the `rabbitMQ` web admin at http://localhost:15672

In order to decrease the stack, you can "scale" the `worker` service like this :

    docker-compose scale worker=11
 
and watch how that 11 workers unstack the avalailable messages in the stack.

