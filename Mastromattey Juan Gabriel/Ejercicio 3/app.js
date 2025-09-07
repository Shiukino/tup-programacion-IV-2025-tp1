const express = require("express");
const app = express();

app.use(express.json());

let tareas = [];

app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || typeof completada !== "boolean") {
    return res.status(400).json({
      error: "Se requiere un nombre y un estado completada (true/false)",
    });
  }

  const existe = tareas.find(
    (t) => t.nombre.toLowerCase() === nombre.toLowerCase()
  );
  if (existe) {
    return res.status(400).json({ error: "La tarea ya existe" });
  }

  const tarea = { nombre, completada };
  tareas.push(tarea);

  res.status(201).json({ mensaje: "Tarea creada", tarea });
});

app.get("/tareas", (req, res) => {
  const { estado } = req.query;

  let resultado = tareas;

  if (estado === "completadas") {
    resultado = tareas.filter((t) => t.completada);
  } else if (estado === "pendientes") {
    resultado = tareas.filter((t) => !t.completada);
  }

  res.json(resultado);
});

app.get("/tareas/:nombre", (req, res) => {
  const nombre = req.params.nombre.toLowerCase();
  const tarea = tareas.find((t) => t.nombre.toLowerCase() === nombre);

  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  res.json(tarea);
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
