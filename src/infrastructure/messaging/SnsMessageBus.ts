import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export class SnsMessageBus {
  private client = new SNSClient({});
  private topicArn = process.env.SNS_TOPIC_ARN!;

  async publishAppointment(msg: any, countryISO: 'PE'|'CL') {
    await this.client.send(new PublishCommand({
      TopicArn: this.topicArn,
      Message: JSON.stringify(msg),
      MessageAttributes: {
        countryISO: { DataType: 'String', StringValue: countryISO }
      }
    }));
  }
}
