import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    'custom:age': {
      dataType: 'String',
      mutable: true,
    },
    'custom:height': {
      dataType: 'String',
      mutable: true,
    },
    'custom:weight': {
      dataType: 'String',
      mutable: true,
    },
    'custom:fitness_goal': {
      dataType: 'String',
      mutable: true,
    },
    'custom:activity_level': {
      dataType: 'String',
      mutable: true,
    },
    'custom:membership_type': {
      dataType: 'String',
      mutable: false,
    },
  },
});
