const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400"); // 24 horas de cache para preflight
    next();
});

// Middleware para log de requisições (útil para debugging no Railway)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rota principal
app.get("/", (req, res) => {
    res.send("Servidor Express está funcionando no Railway!");
});

// Rota para buscar detalhes do item
app.get("/proxy/item-details/:assetId", async (req, res) => {
    const assetId = req.params.assetId;
    const url = `https://catalog.roblox.com/v1/catalog/items/${assetId}/details?itemType=Asset`;

    try {
        const response = await axios.get(url);
        const unitsAvailableForConsumption = response.data.unitsAvailableForConsumption || "N/A";
        res.json({ unitsAvailableForConsumption });
    } catch (error) {
        console.error("Erro ao buscar dados da API Roblox:", error.message);
        res.status(error.response?.status || 500).json({
            error: "Erro ao buscar dados da API Roblox",
            details: error.response?.data || error.message,
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
