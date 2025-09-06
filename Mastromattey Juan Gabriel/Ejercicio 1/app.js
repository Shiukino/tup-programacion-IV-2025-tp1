const express = require("express");
const app = express();

app.use(express.json());

let calculos = [];

app.post("/rectangulos", (req, res) => {
  const { base, altura } = req.body;

  if (!base || !altura || base <= 0 || altura <= 0) {
    return res
      .status(400)
      .json({ error: "Base y altura deben ser numeros positivos" });
  }

  const perimetro = 2 * (base + altura);
  const superficie = base * altura;

  const calculo = { base, altura, perimetro, superficie };
  calculos.push(calculo);

  res.status(201).json({ mensaje: "Calculo realizado y guardado", calculo });
});

app.get("/rectangulos", (req, res) => {
  const resultados = calculos.map((c) => {
    const tipo = c.base === c.altura ? "Cuadrado" : "Rectangulo";
    return { ...c, tipo };
  });

  res.json(resultados);
});

app.get("/rectangulos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (id < 0 || id >= calculos.length) {
    return res.status(404).json({ error: "Calculo no encontrado" });
  }

  const c = calculos[id];
  const tipo = c.base === c.altura ? "Cuadrado" : "Rectangulo";

  res.json({ ...c, tipo });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
