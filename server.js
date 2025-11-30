const express = require("express");
const path = require("path");
const cors = require('cors');
const app = express();

app.use(cors());
// Le dossier contenant le build Angular
const angularDistPath = path.join(__dirname, "dist/assigment-app/browser");

// Fichiers statiques
app.use(express.static(angularDistPath));

// Route catch-all renvoyant index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(angularDistPath, "index.html"));
});

// Lancement serveur
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

