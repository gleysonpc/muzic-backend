import { Schema } from 'dynamoose';

export const PageSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  slug: {
    type: String,
  },
  userId: {
    type: String,
  },
});
