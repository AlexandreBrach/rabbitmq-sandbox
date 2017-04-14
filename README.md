
This is a small sand box to see a basic application/worker model around rabbitMQ message bus. The provided `docker-compose` instanciate : 
* a rabbitMQ service 
* a main NodeJS application that push a message every 100 miliseconds on it
* a worker that unshift a message every seconds

There's no need to provide .env, just have the tcp port 15672 available on your host.
    
You can see the messages stack growing in the rabbitMQ web admin at http://localhost:15672

In order to decrease the stack, you can "scale" the `worker` service like this :

    docker-compose scale worker=11
 
You can see how that 11 workers should unstack the avalailable messages in the stack.

