const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "gifts.json";

// 🔥 lê os dados
function readData() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

// 💾 salva os dados
function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// 📥 pegar todos os presentes
app.get("/gifts", (req, res) => {
  res.json(readData());
});

// ➕ adicionar seleção (incrementa contador)
app.post("/gifts/:index", (req, res) => {
  const data = readData();
  const index = req.params.index;
  const action = req.body.action;

  if (!data[index]) {
    return res.status(404).json({ error: "Item não encontrado" });
  }

  if (action === "increase") {
    data[index].count = 1; // trava em 1 (tipo reservado)
  }

  if (action === "decrease") {
    data[index].count = 0;
  }

  saveData(data);
  res.json(data);
});

// 🚀 iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});