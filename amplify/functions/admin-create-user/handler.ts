import { env } from "$amplify/env/admin-create-user";
import {
  AdminCreateUserCommand,
  CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";
import { Schema } from "../../data/resource";

const client = new CognitoIdentityProviderClient()

type Handler = Schema['adminCreateUser']['functionHandler']
export const handler: Handler = async (event) => {
  try {
    const { email, password } = event.arguments
    const command = new AdminCreateUserCommand({
      Username: email,
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
      ],
      ValidationData: [
        {
          Name: 'email',
          Value: email
        },
      ],
      UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
    })
    const response = await client.send(command)

    return { content: response.User?.Username };
  } catch (e) {
    console.log("Exception");
    console.log(e);
    console.log("Incoming event");
    console.log(event);
    return { content: "An unexpected error has occured while processing your request." };
  }
}