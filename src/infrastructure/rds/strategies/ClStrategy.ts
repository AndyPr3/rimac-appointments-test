import { CountryWriter } from '../CountryStrategy';
import { getConnection } from '../MySqlClient';

export const ClStrategy: CountryWriter = {
  async persist(dto) {
    const conn = await getConnection();
    try {
      await conn.execute(
        `INSERT INTO appointments_rds (requestId, insuredId, scheduleId, countryISO, createdAt)
         VALUES (?, ?, ?, 'CL', NOW())`,
        [dto.requestId, dto.insuredId, dto.scheduleId]
      );
    } finally { await conn.end(); }
  }
};
