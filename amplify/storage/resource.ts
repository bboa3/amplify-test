import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'enerminaStorage',
  access: (allow) => ({
    'users/*': [
      allow.groups(['ADMIN', 'PROFESSIONAL', 'SUBSCRIBER']).to(['read', 'write', 'delete']),
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
    'articles/*': [
      allow.groups(['ADMIN']).to(['read', 'write', 'delete']),
      allow.groups(['SUBSCRIBER', 'PROFESSIONAL']).to(['read']),
      allow.authenticated.to(['read']),
      allow.guest.to(['read'])
    ],
    'businesses/*': [
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'write', 'delete']),
      allow.groups(['SUBSCRIBER']).to(['read']),
      allow.authenticated.to(['read']),
      allow.guest.to(['read'])
    ],
    'resources/*': [
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'write', 'delete']),
      allow.groups(['SUBSCRIBER']).to(['read']),
      allow.authenticated.to(['read']),
      allow.guest.to(['read'])
    ]
  })
});