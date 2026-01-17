/// <reference lib="webworker" />

addEventListener('message', (event: MessageEvent) => {
    console.log('worker received message: ' , event.data);
});

// addEventListener('message', ({ data }) => {
//     console.log('worker received message: ' + data);
//     });


    
postMessage('blah blah2' );