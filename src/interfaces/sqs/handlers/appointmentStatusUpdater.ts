import { SQSEvent } from 'aws-lambda';
import { DynamoAppointmentRepository } from '../../../infrastructure/dynamodb/DynamoAppointmentRepository';

const repo = new DynamoAppointmentRepository();

export const main = async (event: SQSEvent) => {
  for (const record of event.Records) {
    let detail: any;
    try {
      const body = JSON.parse(record.body);
      const fromMessage = body?.Message ? JSON.parse(body.Message) : undefined;
      detail = body?.detail || fromMessage?.detail;
    } catch {
      detail = undefined;
    }
    if (!detail?.requestId || !detail?.insuredId) continue;
    await repo.complete(detail.requestId, detail.insuredId);
  }
};
