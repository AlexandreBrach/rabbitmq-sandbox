
This repository is a sand box that provide some scenarios around AMQP messaging protocole (using rabbitMQ).

# Scenarios

For each scenario, there is a git tag, so you can switch between them using `git checkout` command.

* 1.0 => a single pipe between one dispatcher and some workers
* 2.0 => using RabbitMQ interface to dispatch messages from exchanges to pipes

# Usage

Use the `launch-dev.sh` file to instanciate the docker containers.
There's no need to provide .env, just have the tcp port 15672 available on your host.

# This scenario : using RabbitMQ interface to dispatch messages from exchanges to pipes

This scenario is pretty the same than the previous but this time the `docker-compose` file instanciate 2 message-dispatchers and 3 kind of workers around a rabbitMQ.

* each dispatcher push a message every 100 miliseconds on its own `RabbitMQ exchange` (the name is configurable, see docker-compose environnement vars)
* each workers unshift a message from their pipe and wait a seconds to simulate some time of work (the pipe names are configurable too)

Once the services instanciated, open the `rabbitMQ` web admin (at http://localhost:15672)
If you keep the `docker-compose.yml` unchanged, you can see 2 exchanges (`channelA` & `channelB`) and 3 queues (`workingPipeA`, `workingPipeB` and `workingPipeC`)

Unlike the previous scenario, although the dispatchers are pushing messages to their exchanges, no messages appear in the queues. It's because no pipes are bound to the exchanges. **If messages are pushed in an exchange without any pipe bound to it, no pipe can store them : all these messages are lost.**

This scenario allow something new : as you can bind some pipes to one `exchange`, a message can be dispatch to two different pipes or more. It can be configured independing of the applications implementation via the `rabbitMQ` interface.

Here, the game is to use the `RabbitMQ` interface to bind the 2 exchanges to the worker queues using the routing keys and etablish a communication between workers and dispatchers. Once made, scale the workers in order to decrease the messages stack, like in the previous scenario.

