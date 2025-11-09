import { v4 as uuid } from 'uuid';
import { AppointmentRepository } from '../../domain/ports/AppointmentRepository';
import { CreateAppointmentDTO } from '../../domain/entities/Appointment';
import { SnsMessageBus } from '../../infrastructure/messaging/SnsMessageBus';

export class CreateAppointment {
  constructor(
    private repo: AppointmentRepository,
    private bus: SnsMessageBus
  ) {}

  async exec(input: CreateAppointmentDTO) {
    const requestId = uuid();
    const now = new Date().toISOString();

    await this.repo.createPending({
      requestId,
      insuredId: input.insuredId,
      scheduleId: input.scheduleId,
      countryISO: input.countryISO,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    });

    await this.bus.publishAppointment({ requestId, ...input }, input.countryISO);
    return { requestId, status: 'pending' };
  }
}
