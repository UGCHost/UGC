const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400"); // Cache preflight requests for 24 hours
    next();
});

// Middleware para log de requisições (útil para debugging no Railway)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rota para a raiz
app.get("/", (req, res) => {
    res.send("Servidor Express está funcionando!");
});

// Rota para detalhes do item
app.get("/proxy/item-details/:assetId", async (req, res) => {
    const assetId = req.params.assetId;
    const url = `https://catalog.roblox.com/v1/catalog/items/${assetId}/details?itemType=Asset`;

    try {
        const response = await axios.get(url);

        // Extraímos apenas o campo 'unitsAvailableForConsumption'
        const unitsAvailableForConsumption = response.data.unitsAvailableForConsumption || "N/A";

        // Enviamos o valor de 'unitsAvailableForConsumption' para o cliente
        res.json({ unitsAvailableForConsumption });
    } catch (error) {
        console.error("Erro ao buscar dados da API Roblox:", error.response?.data || error.message);

        // Retorna uma mensagem de erro detalhada para o cliente
        res.status(500).json({
            error: "Erro ao buscar dados da API Roblox",
            details: error.response?.data || error.message,
        });
    }
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
    console.log(`Proxy rodando em http://localhost:${PORT}`);
});
