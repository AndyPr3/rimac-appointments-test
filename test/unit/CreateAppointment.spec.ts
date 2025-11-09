import { CreateAppointment } from '../../src/application/usecases/CreateAppointment';

describe('CreateAppointment', () => {
  it('marca pending y publica SNS', async () => {
    const repo = { createPending: jest.fn() } as any;
    const bus = { publishAppointment: jest.fn() } as any;
    const uc = new CreateAppointment(repo, bus);
    const out = await uc.exec({ insuredId: '00012', scheduleId: 100, countryISO: 'PE' });
    expect(out.status).toBe('pending');
    expect(repo.createPending).toHaveBeenCalledTimes(1);
    expect(bus.publishAppointment).toHaveBeenCalledTimes(1);
  });
});
