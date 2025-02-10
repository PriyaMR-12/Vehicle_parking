const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const QRCode = require('qrcode');
const app = express();
const port = 5001;
// Enable CORS for all origins
app.use(cors());
// Serve static files from the root directory (for serving HTML)
app.use(express.static(__dirname));
// MongoDB connection
mongoose.connect(
'mongodb+srv://mrpriya324:Barbie1234%24@cluster0.qnu2hqe.mongodb.net/vehicle_parking?retryWrites=true&w=majority&appName=Cluster0',
{
useNewUrlParser: true,
useUnifiedTopology: true,
}
);
mongoose.connection.once('open', () => {
console.log('Connected to MongoDB');
});
// Booking Schema
const bookingSchema = new mongoose.Schema({
slotId: String,
});
const Booking = mongoose.model('Booking', bookingSchema, 'bookings');
// Vehicle Info Schema
const vehicleInfoSchema = new mongoose.Schema({
name: String,
email: String,
Parking_time: String, // Change to 'String' if stored as a string in MongoDB
End_time: String, // Same as above
Date: String, // Same as above
});
const Vehicle_info = mongoose.model('vehicle_infos', vehicleInfoSchema, 'Vehicle_info');
app.get('/get-ticket', async (req, res) => {
try {
// Fetch the latest booking
const booking = await Booking.findOne().sort({ _id: -1 });
if (!booking) {
return res.status(404).json({ message: 'No booking data found' });
}
// Fetch the latest two Vehicle_info documents
const vehicleInfoDocs = await Vehicle_info.find().sort({ _id: -1 }).limit(2);
if (vehicleInfoDocs.length < 1) {
return res.status(404).json({ message: 'Insufficient ticket data found' });
}
// Extract name/email and parking time info
const vehicleInfo = vehicleInfoDocs.find(doc => doc.name && doc.email) || {};
const parkingInfo = vehicleInfoDocs.find(doc => doc.Parking_time && doc.End_time) || {};
// Combine data
const ticketData = {
name: vehicleInfo.name || 'N/A',
email: vehicleInfo.email || 'N/A',
slotId: booking.slotId || 'N/A',
Parking_time: parkingInfo.Parking_time || 'N/A',
End_time: parkingInfo.End_time || 'N/A',
Date: parkingInfo.Date || 'N/A',
};
// Generate QR code
const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(ticketData));
// Send response
res.json({ ticketData, qrCodeUrl });
} catch (error) {
console.error('Error fetching ticket:', error);
res.status(500).json({ error: 'Failed to fetch ticket' });
}
});
// Start the Server
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});