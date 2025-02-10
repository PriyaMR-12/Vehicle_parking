const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5003; // You can adjust this port
// Middleware
app.use(express.json()); // Parse incoming JSON data
app.use(cors()); // Allow CORS requests (adjust for production)
// MongoDB connection
mongoose.connect('mongodb+srv://mrpriya324:Barbie1234%24@cluster0.qnu2hqe.mongodb.net/vehicle_parking?retryWrites=true&w=majority&appName=Cluster0', {
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));
// Define Mongoose schema
const parkingSchema = new mongoose.Schema({
time: String,
parkingTime: String,
endTime: String,
date: String
});
const Parking = mongoose.model('timing_info', parkingSchema);
// Handle POST request for parking data
app.post('/submit-parking', async (req, res) => {
try {
const { time, parkingTime, endTime, date } = req.body;
// Create a new Parking document
const newParking = new Parking({ 
time, 
parkingTime, 
endTime, 
date
});
// Save the document to the database
await newParking.save();
res.status(201).json({ message: 'Parking data saved successfully!' }); 
} catch (error) {
console.error('Error saving parking data:', error);
res.status(500).json({ error: 'Failed to save parking data.' });
}
});
// Start the server
app.listen(port, () => {
console.log(`Server listening on port ${port}`);
});