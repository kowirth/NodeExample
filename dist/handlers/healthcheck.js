"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const pool = new pg_1.Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT) || 5432,
});
// HealthCheck Endpoint
app.get('/healthcheck', (req, res) => {
    try {
        console.log('Healthcheck endpoint queried');
        res.status(200).json({ status: 'ok' });
    }
    catch (e) {
        console.error('Healthcheck error:', e.message);
        res.status(500).json({ status: e.message });
    }
});
// Flight Summary Endpoint. Returns a paginated summary of flights, and includes a summary of the pagination as requested
app.get('/flights', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    try {
        const [{ rows: flights }, { rows: [{ count }] }] = yield Promise.all([
            pool.query(`SELECT tail_number, origin, destination
         FROM goodwin.aircraft_flights
         ORDER BY id
         LIMIT $1 OFFSET $2`, [Number(limit), offset]),
            pool.query('SELECT COUNT(*) FROM goodwin.aircraft_flights'),
        ]);
        res.status(200).json({
            items: flights,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(Number(count) / Number(limit)),
                totalItems: Number(count),
            },
        });
    }
    catch (e) {
        console.error('Flight summary error:', e.message);
        res.status(500).json({ error: e.message });
    }
}));
// Flight Detail Endpoint. Returns detailed information about a specific flight and its status baed upon the id.
app.get('/flights/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { rows } = yield pool.query(`SELECT id, flight_id, tail_number, origin, destination,
              actual_runway_departure_time, actual_runway_arrival_time
       FROM goodwin.aircraft_flights
       WHERE id = $1`, [id]);
        if (rows.length === 0)
            return res.status(404).json({ error: 'Flight not found' });
        const flight = rows[0];
        const status = !flight.actual_runway_departure_time
            ? 'Not departed'
            : !flight.actual_runway_arrival_time
                ? 'En route'
                : flight.actual_runway_departure_time !== flight.actual_runway_arrival_time
                    ? 'Arrived'
                    : 'Result unknown';
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
    }
    catch (e) {
        console.error('Flight detail error:', e.message);
        res.status(500).json({ error: e.message });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
exports.default = app;
//# sourceMappingURL=healthcheck.js.map