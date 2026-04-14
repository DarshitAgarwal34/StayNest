import { query } from '../db/connection.js';

const serviceSelect = `
  SELECT
    s.id,
    s.provider_id,
    s.title,
    s.description,
    s.price,
    s.location,
    s.created_at,
    u.name AS provider_name,
    u.email AS provider_email
  FROM services s
  INNER JOIN users u ON u.id = s.provider_id
`;

const ServiceModel = {
  async create(payload) {
    const { provider_id, title, description = null, price, location } = payload;

    const result = await query(
      `
        INSERT INTO services
          (provider_id, title, description, price, location)
        VALUES (?, ?, ?, ?, ?)
      `,
      [provider_id, title, description, price, location]
    );

    return this.findById(result.insertId);
  },

  async findById(id) {
    const rows = await query(`${serviceSelect} WHERE s.id = ? LIMIT 1`, [id]);
    return rows[0] || null;
  },

  async findAll() {
    return query(`${serviceSelect} ORDER BY s.id DESC`);
  },

  async update(id, payload) {
    const fields = [];
    const values = [];

    ['title', 'description', 'price', 'location'].forEach((field) => {
      if (payload[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(payload[field]);
      }
    });

    if (fields.length) {
      await query(`UPDATE services SET ${fields.join(', ')} WHERE id = ?`, [
        ...values,
        id,
      ]);
    }

    return this.findById(id);
  },

  async delete(id) {
    const existingService = await this.findById(id);

    if (!existingService) {
      return null;
    }

    await query('DELETE FROM services WHERE id = ?', [id]);
    return existingService;
  },
};

export default ServiceModel;
