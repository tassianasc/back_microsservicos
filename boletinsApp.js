require('dotenv').config({ path: './.env.boletins' });
const express = require('express');
const cors = require('cors');
const connectMongoDB = require('./config/db');
const boletinsRoutes = require('./routes/boletinsRoutes');
const path = require('path');

const app = express();

// Configuração de CORS
app.use(cors({ origin: 'http://localhost:3000' })); // Permite que o front-end acesse o back-end
app.use(express.json());  // Middleware para parser de JSON
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serve os uploads

// Conecta ao MongoDB usando a URI do arquivo .env.boletins
connectMongoDB(process.env.MONGO_URI);

// Rotas de Boletins
app.use('/api/boletins', boletinsRoutes);

// Middleware de Tratamento de Erros Global
app.use((err, req, res, next) => {
    console.error('Erro capturado pelo middleware:', err.stack);
    res.status(500).json({ error: 'Ocorreu um erro no servidor!' });
});

// Define a porta do servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Microsserviço de Boletins rodando na porta ${PORT}`);
});