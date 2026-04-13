const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

function getFile(name) {
  return `${name}.json`;
}

function readData(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

app.get("/:type", (req, res) => {
  res.json(readData(getFile(req.params.type)));
});

app.post("/:type/:index", (req, res) => {
  const type = req.params.type;
  const file = getFile(type);
  const data = readData(file);

  const index = Number(req.params.index);
  const action = req.body.action;

  if (!data[index]) {
    return res.status(404).json({ error: "Item não encontrado" });
  }

  if (type === "gifts") {
    if (action === "increase") data[index].count = 1;
    if (action === "decrease") data[index].count = 0;
  }

  if (type === "peoples") {
    if (action === "select") data[index].bool = true;
    if (action === "unselect") data[index].bool = false;
  }

  saveData(file, data);
  res.json(data);
});

app.listen(3000, () => {
  console.log("🔥 Servidor rodando na porta 3000");
});