import { Schema } from 'dynamoose';

export const UserSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    index: [{ name: 'userByEmail', type: 'global' }],
  },
  password: {
    type: String,
  },
});
