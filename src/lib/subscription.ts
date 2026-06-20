import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({ region: process.env.AWS_REGION ?? 'ca-central-1' })
const ddb = DynamoDBDocumentClient.from(client)
const TABLE = 'tchitchat-subscribers'

export async function getSubscriber(userId: string) {
  const r = await ddb.send(new GetCommand({ TableName: TABLE, Key: { userId } }))
  return r.Item ?? null
}

export async function isAdFree(userId: string): Promise<boolean> {
  const sub = await getSubscriber(userId)
  return sub?.status === 'active' || sub?.status === 'trialing'
}

export async function upsertSubscriber(data: {
  userId: string; email: string; stripeCustomerId?: string;
  subscriptionId?: string; status: string; currentPeriodEnd?: number
}) {
  await ddb.send(new PutCommand({ TableName: TABLE, Item: { ...data, updatedAt: Date.now() } }))
}

export async function updateSubscriberStatus(userId: string, status: string, extra?: Record<string, unknown>) {
  await ddb.send(new UpdateCommand({
    TableName: TABLE, Key: { userId },
    UpdateExpression: 'SET #s = :s, updatedAt = :t',
    ExpressionAttributeNames: { '#s': 'status' },
    ExpressionAttributeValues: { ':s': status, ':t': Date.now(), ...extra },
  }))
}
