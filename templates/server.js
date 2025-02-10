const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3001;
const cors = require('cors');
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb+srv://mrpriya324:Barbie1234$@cluster0.qnu2hqe.mongodb.net/vehicle_parking?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, 
useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
console.error('MongoDB connection error:', err);
});
// Define schema and model
const bookingSchema = new mongoose.Schema({
name: String,
slotId: String,
reserved: { type: Boolean, default: false } // Field to track reservation status
});
const Reservation = mongoose.model('bookings', bookingSchema);
// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
// Reserve slot endpoint
app.post('/reserve-slot', async (req, res) => {
console.log(req.body); // Log request body to debug
const { name, slotId } = req.body;
// Validate the input
if (!name || !slotId) {
return res.status(400).json({ message: 'Missing name or slotId' });
}
try {
// Check if the slot is already reserved
const existingReservation = await Reservation.findOne({ slotId, reserved: true });
if (existingReservation) {
return res.status(400).json({ message: 'Slot already reserved.' });
}
// Create a new reservation and mark it as reserved
const reservation = new Reservation({ name, slotId, reserved: true });
await reservation.save();
res.status(200).json({ message: 'Slot reserved successfully.' });
} catch (error) {
console.error(error);
res.status(500).json({ message: 'Internal server error.' });
}
});
// Get all available slots endpoint
app.get('/available-slots', async (req, res) => {
try {
// Find all slots that are not reserved
const availableSlots = await Reservation.find({ reserved: false });
res.status(200).json(availableSlots); // Return the available slots
} catch (error) {
console.error(error);
res.status(500).json({ message: 'Internal server error.' });
}
});
// Get all slots (reserved or not)
app.get('/all-slots', async (req, res) => {
try {
const allSlots = await Reservation.find(); // Fetch all slots, regardless of reserved status
res.status(200).json(allSlots); // Return all slots as JSON
} catch (error) {
console.error(error);
res.status(500).json({ message: 'Internal server error.' });
}
});
// Start server
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
