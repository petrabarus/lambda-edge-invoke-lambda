const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const https = require('https');

const REGION = 'us-east-1';

async function getSecrets() {
    const client = new SecretsManagerClient({
        region: REGION
    });
    const command = new GetSecretValueCommand({
        SecretId: 'LAMBDA_EDGE_INVOKE_SECRETS',
    });

    const response = await client.send(command);
    const retval = JSON.parse(response.SecretString);
    console.log(retval);

    return retval;
}

async function invokeLambda(arn) {
    const client = new LambdaClient({
        region: REGION
    });
    const command = new InvokeCommand({
        FunctionName: arn,
    });
    const response = await client.send(command);
    console.log(response.StatusCode);
}

function requestUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                console.log(body);
                resolve(body);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

exports.handler =  async function(event, context, callback) {
    console.dir(event);
    const request = event.Records[0].cf.request;
    const secrets = await getSecrets();
    const functionArn = secrets['FUNCTION_ARN'];
    const functionUrl = secrets['FUNCTION_URL'];

    switch (request['uri']) {
        case '/file1.html':
            console.log(`Invoking Lambda via Function URL: ${functionUrl}`);
            await requestUrl(functionUrl);
            break;
        case '/file2.html':
            console.log(`Invoking Lambda via SDK: ${functionArn}`);
            await invokeLambda(functionArn);
            break;
        case '/file3.html':
            const url = 'https://www.example.com';
            console.log(`Invoking Non-AWS URL: ${url}`);
            await requestUrl(url);
            break;
        default:
            break;
    }
    
    callback(null, request);
}
