import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoAppointmentRepository } from '../../../infrastructure/dynamodb/DynamoAppointmentRepository';
import { SnsMessageBus } from '../../../infrastructure/messaging/SnsMessageBus';
import { CreateAppointment } from '../../../application/usecases/CreateAppointment';
import { ListAppointments } from '../../../application/usecases/ListAppointments';

const repo = new DynamoAppointmentRepository();
const bus = new SnsMessageBus();

function getMethodAndPathParams(event: any) {
  // REST
  if (event.httpMethod) {
    return { method: event.httpMethod, pathParams: event.pathParameters ?? {} };
  }
  // HTTP API
  const method = event.requestContext?.http?.method;
  return { method, pathParams: event.pathParameters ?? {} };
}

export const main: APIGatewayProxyHandler = async (event) => {
  try {
    const { method, pathParams } = getMethodAndPathParams(event);

    if (method === 'POST') {
      const body = JSON.parse(event.body ?? '{}');
      if (!/^[0-9]{5}$/.test(body.insuredId) || !['PE','CL'].includes(body.countryISO)) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Bad Request' }) };
      }
      const usecase = new CreateAppointment(repo, bus);
      const out = await usecase.exec(body);
      return { statusCode: 202, body: JSON.stringify(out) };
    }

    if (method === 'GET') {
      const insuredId = pathParams?.insuredId || '';
      const usecase = new ListAppointments(repo);
      const items = await usecase.exec(insuredId);
      return { statusCode: 200, body: JSON.stringify(items) };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Error' }) };
  }
};
