exports.handler =  async function(event, context) {
    console.dir(event);
    
    return {
        statusCode: 200,
        headers: {
           'Content-Type': 'text/plain',
        },
        body: 'Hello World!',
    }
}
