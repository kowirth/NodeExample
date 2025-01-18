import express, { Response, Request } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT) || 5432,
});

// HealthCheck Endpoint
app.get('/healthcheck', (req: Request, res: Response) => {
  try {
    console.log('Healthcheck endpoint queried');
    res.status(200).json({ status: 'ok' });
  } catch (e) {
    console.error('Healthcheck error:', e.message);
    res.status(500).json({ status: e.message });
  }
});

// Flight Summary Endpoint. Returns a paginated summary of flights, and includes a summary of the pagination as requested
app.get('/flights', async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  console.log(`Flights summary queried: page=${page}, limit=${limit}`);

  try {
    const [{ rows: flights }, { rows: [{ count }] }] = await Promise.all([
      pool.query(
        `SELECT tail_number, origin, destination
         FROM goodwin.aircraft_flights
         ORDER BY id
         LIMIT $1 OFFSET $2`,
        [Number(limit), offset]
      ),
      pool.query('SELECT COUNT(*) FROM goodwin.aircraft_flights'),
    ]);

    console.log('Flights fetched:', flights);
    console.log('Total flight count:', count);

    res.status(200).json({
      items: flights,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(Number(count) / Number(limit)),
        totalItems: Number(count),
      },
    });
  } catch (e) {
    console.error('Flight summary error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Flight Detail Endpoint. Returns detailed information about a specific flight and its status based upon the id.
app.get('/flights/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(`Flight detail queried: id=${id}`);

  try {
    const { rows } = await pool.query(
      `SELECT id, flight_id, tail_number, origin, destination,
              actual_runway_departure_time, actual_runway_arrival_time
       FROM goodwin.aircraft_flights
       WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      console.warn(`Flight with id=${id} not found`);
      return res.status(404).json({ error: 'Flight not found' });
    }

    const flight = rows[0];
    const status =
      !flight.actual_runway_departure_time
        ? 'Not departed'
        : !flight.actual_runway_arrival_time
        ? 'En route'
        : flight.actual_runway_departure_time !== flight.actual_runway_arrival_time
        ? 'Arrived'
        : 'Result unknown';

    console.log('Flight details:', flight);
    console.log('Flight status:', status);

    res.status(200).json({
      flight: {
        id: flight.id,
        flight_id: flight.flight_id,
        tail_number: flight.tail_number,
        origin: flight.origin,
        destination: flight.destination,
        status,
      },
    });
  } catch (e) {
    console.error(`Flight detail error for id=${id}:`, e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;