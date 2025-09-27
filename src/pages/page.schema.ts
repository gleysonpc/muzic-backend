import { Schema } from 'dynamoose';

export const PageSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  // The `slug` attribute is used as the hash key for a Global Secondary Index named `pageBySlug`.
  // Declare the index so dynamoose can include the proper IndexName and KeyConditionExpression
  // when using `.using('pageBySlug')` in queries.
  slug: {
    type: String,
    index: [
      {
        name: 'pageBySlug',
        // dynamoose v4 expects the index `type` to be 'global' or 'local'
        type: 'global',
      },
    ],
  },
  userId: {
    type: String,
  },
});
