const express = require("express");
const app = express();

app.use(express.json());

let alumnos = [];

app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).json({
      error: "Nombre y 3 notas requeridos",
    });
  }

  if (alumnos.find((a) => a.nombre.toLowerCase() === nombre.toLowerCase())) {
    return res.status(400).json({
      error: "El alumno ya existe",
    });
  }

  alumnos.push({ nombre, notas });
  res.status(201).json({ mensaje: "Alumno agregado" });
});

app.get("/alumnos", (req, res) => {
  const resultados = alumnos.map((a) => {
    const promedio = (a.notas[0] + a.notas[1] + a.notas[2]) / 3;
    let estado;

    if (promedio < 6) estado = "Reprobado";
    else if (promedio < 8) estado = "Aprobado";
    else estado = "Promocionado";

    return { ...a, promedio, estado };
  });

  res.json(resultados);
});

app.get("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre.toLowerCase();
  const alumno = alumnos.find((a) => a.nombre.toLowerCase() === nombre);

  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }

  const promedio = (alumno.notas[0] + alumno.notas[1] + alumno.notas[2]) / 3;
  let estado;

  if (promedio < 6) estado = "Reprobado";
  else if (promedio < 8) estado = "Aprobado";
  else estado = "Promocionado";

  res.json({ ...alumno, promedio, estado });
});

app.put("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre.toLowerCase();
  const { notas } = req.body;

  const alumno = alumnos.find((a) => a.nombre.toLowerCase() === nombre);

  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }

  if (!Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).json({
      error: "Se requiere un arreglo de 3 notas",
    });
  }

  alumno.notas = notas;
  res.json({ mensaje: "Notas actualizadas", alumno });
});

app.delete("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre.toLowerCase();
  const index = alumnos.findIndex((a) => a.nombre.toLowerCase() === nombre);

  if (index === -1) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }

  alumnos.splice(index, 1);
  res.json({ mensaje: "Alumno eliminado" });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
