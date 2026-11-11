
const express = require('express');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// Dummy patient data - no real PHI
const patients = [
    { id: 1, name: 'Patient One', condition: 'Diabetes' },
    { id: 2, name: 'Patient Two', condition: 'Hypertension' },
    { id: 3, name: 'Patient Three', condition: 'Asthma' }
];

// Application health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'Healthcare API'
    });
});

// Retrieve all dummy patient records
app.get('/api/patients', (req, res) => {
    res.json(patients);
});

// Retrieve a patient by ID
app.get('/api/patients/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Invalid patient ID'
        });
    }

    const patient = patients.find(p => p.id === id);

    if (!patient) {
        return res.status(404).json({
            error: 'Patient not found'
        });
    }

    res.json(patient);
});

// Reject unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Healthcare API running on port ${PORT}`);
});
