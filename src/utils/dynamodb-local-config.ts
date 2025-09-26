const isLocal = process.env.STAGE === 'offline';

console.log('Running in local mode:', isLocal);
export const dynamoLocalConfig = isLocal
  ? {
      local: process.env.DYNAMO_ENDPOINT || 'http://localhost:8080',
    }
  : {};
