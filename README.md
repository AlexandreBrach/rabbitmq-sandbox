
This repository is my own sand box in wich I learn and experiment some scenarios around AMQP messaging protocole (using rabbitMQ).

# Scenarios

For each scenario, there is a git tag, so you can switch between them using `git checkout` command.

* 1.0 => a single pipe between one dispatcher and some workers
* 2.0 => using RabbitMQ interface to dispatch messages from exchanges to pipes
* 3.0 => publish/subscribe

# Usage

Use the `launch-dev.sh` file to instanciate the docker containers.
There's no need to provide .env, just have the tcp port 15672 available on your host.

# This scenario : publish/subscribe

In this scenario, there is a message broadcaster and a listener (scalable).
As soon a message is sent by broadcast, each listener print the message in the standard output.

The difference between the `brodcaster` and the previous `message-bus` is that the broadcaster create and send messages in a `fanout` typed exchange, instead of a `topic` one. The difference is that there's no need to have routing key : each message that will be sent to the exchange wil be transmitted to any bound pipe.

This time, each `worker` create its own exclusive pipe (randomly named by `rabbitMQ`) bound to the exchange.
When it die, the pipe is automatically destroyed. 
You can watch this behavior scaling the `worker` and listing the queues in `RabbitMQ` admin interface. (it's also possible to scale the `dispatcher`)
