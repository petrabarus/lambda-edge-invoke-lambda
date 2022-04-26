exports.handler =  async function(event, context, callback) {
    console.dir(event);
    const request = event.Records[0].cf.request;

    switch (request['uri']) {
        case '/file1.html':
            console.log('Invoking Lambda via Function URL');

            break;
        case '/file2.html':
            console.log('Invoking Lambda via SDK');

            break;
        case '/file3.html':
            console.log('Invoking Non-AWS URL');

            break;
        default:
            break;
    }
    
    callback(null, request);
}
