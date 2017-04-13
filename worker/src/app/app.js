var rabbit = {
    url : "amqp://rabbit:rabbit@message-bus",
    queueName : 'the.bus'
}

var messageBus = require( './message-bus' );
var theBus = new messageBus( rabbit.url, rabbit.queueName );

// UNCOMMENT TO RUN ME !

theBus.connect().then( function() {
    console.log( 'connected' );
    main();
} )
.catch( function( err ) {
    console.error( err );
} );

function main() {
    setInterval( function() {
        console.log( 'ready to work!' );
        theBus.consumeMessage()
            .then( processMessage )
            .catch( function (err) { 
                console.log( err );
            } );
    }, 500 );
}

processMessage = function( msg ) {
    var body = msg.content.toString();
    console.log( 'Get this message : ' + body );
    theBus.acknowledge( msg );
}

