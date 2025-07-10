import { defineAuth } from '@aws-amplify/backend';
import { addUserToGroup } from '../functions/add-user-to-group/resource';
import { adminCreateUser } from '../functions/admin-create-user/resource';
import { postConfirmation } from './post-confirmation/resource';

const GROUP = ['ADMIN', 'PROFESSIONAL', 'SUBSCRIBER']

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  senders: {
    email: {
      fromEmail: "svp@enermina.org",
      fromName: "Enermina Support"
    },
  },
  groups: GROUP,
  triggers: {
    postConfirmation
  },
  access: (allow) => [
    allow.resource(addUserToGroup).to(["addUserToGroup"]),
    allow.resource(adminCreateUser).to(["createUser"]),
  ],
});
