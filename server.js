import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtém o caminho do diretório atual usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Diretório onde o arquivo server.js está localizado

import routes from "./src/routes/postsRoutes.js";

const app = express();

// Serve a pasta 'uploads' como arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

routes(app);

app.listen(3000, () => {
    console.log("Servidor rodando...");
});

