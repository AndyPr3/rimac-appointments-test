import { AppointmentRepository } from '../../domain/ports/AppointmentRepository';
export class ListAppointments {
  constructor(private repo: AppointmentRepository) {}
  exec(insuredId: string) {
    return this.repo.listByInsured(insuredId);
  }
}
