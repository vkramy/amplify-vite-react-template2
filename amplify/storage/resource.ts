import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'bitfitProStorage',
  access: (allow) => ({
    'posture-photos/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
    'profile-photos/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
  }),
});