import { AppointmentRecord } from '../entities/Appointment';

export interface AppointmentRepository {
  createPending(rec: AppointmentRecord): Promise<void>;
  complete(requestId: string, insuredId: string): Promise<void>;
  listByInsured(insuredId: string): Promise<AppointmentRecord[]>;
  getByRequestId?(requestId: string): Promise<AppointmentRecord | undefined>;
}
