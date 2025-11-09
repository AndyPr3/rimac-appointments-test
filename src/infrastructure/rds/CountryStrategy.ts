import { CreateAppointmentDTO } from '../../domain/entities/Appointment';

export interface CountryWriter {
  persist(dto: CreateAppointmentDTO & { requestId: string, metadata?: any }): Promise<void>;
}

export class CountryStrategy {
  constructor(private readonly impl: Record<'PE'|'CL', CountryWriter>) {}
  writer(country: 'PE'|'CL') { return this.impl[country]; }
}
