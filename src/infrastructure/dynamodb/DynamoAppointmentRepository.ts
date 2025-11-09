import { DynamoDBClient, PutItemCommand, UpdateItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { AppointmentRepository } from '../../domain/ports/AppointmentRepository';
import { AppointmentRecord } from '../../domain/entities/Appointment';

const TableName = process.env.DYNAMO_TABLE!;

export class DynamoAppointmentRepository implements AppointmentRepository {
  private client = new DynamoDBClient({});

  async createPending(rec: AppointmentRecord): Promise<void> {
    await this.client.send(new PutItemCommand({ TableName, Item: marshall(rec) }));
  }

  async complete(requestId: string, insuredId: string): Promise<void> {
    await this.client.send(new UpdateItemCommand({
      TableName,
      Key: marshall({ insuredId, requestId }),
      UpdateExpression: 'SET #s = :s, updatedAt = :u',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: marshall({ ':s': 'completed', ':u': new Date().toISOString() })
    }));
  }

  async listByInsured(insuredId: string): Promise<AppointmentRecord[]> {
    const res = await this.client.send(new QueryCommand({
      TableName,
      KeyConditionExpression: 'insuredId = :id',
      ExpressionAttributeValues: marshall({ ':id': insuredId })
    }));
    return (res.Items ?? []).map(i => unmarshall(i) as AppointmentRecord);
  }
}
