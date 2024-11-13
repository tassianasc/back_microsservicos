const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configurações de CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Proxy para o serviço de notícias (sem pathRewrite)
app.use('/api/noticias', createProxyMiddleware({
    target: 'http://localhost:5000',  // Target para o microsserviço de notícias na porta 5000
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: (path, req) => {
        // Ajusta a URL para garantir que o caminho com o ID seja mantido corretamente
        if (path.includes('/api/noticias/')) {
            return path;  // Manter o caminho como está, incluindo o ID
        }
        return '/api/noticias';  // Para as requisições sem ID
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log('Proxy request para o serviço de notícias:', req.url);
    },
    onError: (err, req, res) => {
        console.error('Erro ao redirecionar para o serviço de notícias:', err.message);
        res.status(500).send('Erro ao redirecionar para o serviço de notícias');
    }
}));

// Proxy para o serviço de boletins (sem pathRewrite)
app.use('/api/boletins', createProxyMiddleware({
    target: 'http://localhost:5001',  // Target para o microsserviço de boletins na porta 5001
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: (path, req) => {
        // Ajusta a URL para garantir que o caminho com o ID seja mantido corretamente
        if (path.includes('/api/boletins/')) {
            return path;  // Manter o caminho como está, incluindo o ID
        }
        return '/api/boletins';  // Para as requisições sem ID
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log('Proxy request para o serviço de boletins:', req.url);
    },
    onError: (err, req, res) => {
        console.error('Erro ao redirecionar para o serviço de boletins:', err.message);
        res.status(500).send('Erro ao redirecionar para o serviço de boletins');
    }
}));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy reverso rodando na porta ${PORT}`);
});