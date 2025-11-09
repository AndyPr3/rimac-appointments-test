import { SQSEvent } from 'aws-lambda';
import { CountryStrategy } from '../../../infrastructure/rds/CountryStrategy';
import { ClStrategy } from '../../../infrastructure/rds/strategies/ClStrategy';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

const strategy = new CountryStrategy({ PE: ClStrategy as any, CL: ClStrategy });
const eb = new EventBridgeClient({});

export const main = async (event: SQSEvent) => {
  for (const record of event.Records) {
    let payload: any;
    try {
      const body = JSON.parse(record.body);
      payload = body.Message ? JSON.parse(body.Message) : body;
    } catch {
      payload = undefined;
    }
    if (!payload?.requestId) continue;

    await strategy.writer('CL').persist(payload);
    await eb.send(new PutEventsCommand({
      Entries: [{
        Source: 'appointments.worker',
        DetailType: 'AppointmentScheduled',
        EventBusName: process.env.EVENT_BUS,
        Detail: JSON.stringify({ requestId: payload.requestId, insuredId: payload.insuredId, countryISO: 'CL' })
      }]
    }));
  }
};
