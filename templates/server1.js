const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(express.json()); // Use express.json() for JSON parsing
app.use(cors()); // Allow all origins by default (use with caution)
app.use(express.static('.')); // Serve static files from the current directory
// Connect to MongoDB
mongoose.connect('mongodb+srv://mrpriya324:Barbie1234%24@cluster0.qnu2hqe.mongodb.net/vehicle_parking?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));
// Define Mongoose schema
const parkingSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true },
location: String, 
mall: String, 
plate: String, 
phone: String
});
const Parking = mongoose.model('Vehicle_info', parkingSchema);
// Route to handle form submission
app.post('/submit-form', async (req, res) => {
console.log('Received data:', req.body);
try {
const newEntry = new Parking(req.body);
await newEntry.save(); // Save the data to MongoDB
console.log('Data saved successfully');
res.json({ message: 'Form submitted successfully!' });
} catch (err) {
console.error('Error saving data:', err.message);
res.status(500).json({ error: 'Failed to save data.', details: err.message });
}
});
// Manually serving the timing.html file
app.get('/timing.html', (req, res) => {
res.sendFile(path.join(__dirname, 'timing.html'));
});
// Start the server
app.listen(3000, () => {
console.log('Server started on port 3000');
});