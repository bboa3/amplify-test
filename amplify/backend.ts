import { defineBackend } from '@aws-amplify/backend';
import { Stack } from "aws-cdk-lib";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from './auth/resource';
import { data } from './data/resource';
import { addOrUpdateSearchableRecord } from './functions/add-or-update-searchable-record/resource';
import { addUserToGroup } from './functions/add-user-to-group/resource';
import { adminCreateUser } from './functions/admin-create-user/resource';
import { createStreamToken } from './functions/create-stream-token/resource';
import { deleteSearchableRecord } from './functions/delete-searchable-record/resource';
import { supportContactEmail } from './functions/support-contact-email/resource';
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  data,
  addUserToGroup,
  adminCreateUser,
  addOrUpdateSearchableRecord,
  deleteSearchableRecord,
  createStreamToken,
  supportContactEmail,
  storage
});

const { cfnUserPool } = backend.auth.resources.cfnResources

cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: false,
    requireNumbers: true,
    requireSymbols: false,
    requireUppercase: false,
  },
};

const supportContactEmailPolicy = new Policy(Stack.of(backend.supportContactEmail.resources.lambda), "SupportContactEmailPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "ses:SendEmail",
        "ses:SendRawEmail",
      ],
      resources: ["*"],
    }),
  ],
});
backend.supportContactEmail.resources.lambda.role?.attachInlinePolicy(supportContactEmailPolicy);