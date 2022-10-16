import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
const pool = new pg.Pool();

const app = express();
const port = process.env.PORT || 3333;

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW()");
  res.send(`Hello, World! The time from the DB is ${rows[0].now}`);
});

app.get("/version", async (req, res) => {
  res.send({name:"IQ-Coffee", version: "0.1.0" });
});

app.listen(port, () => {
  console.log(`Example app. listening at http://localhost:${port}`);
});

let sensor = {
  device_ID: "",
  temp_1: "",
  temp_2: "",
  temp_3: "",
  temp_4: "",
  temp_ambiente: "",
  humedad: "",
  timestamp: ""
}

app.post("/sensor", async (req, res) => {
  var result = { success: false, message: "", data: {} }
  let sensor = req.body;
  if (sensor.device_ID != null) {
    if (sensor.device_ID != '') {

      result.success = true;
      result.message = 'El device ' + sensor.device_ID + ' midio las temperaturas el dia ' + sensor.timestamp + '.';
      res.statusCode = 201;
    }
    else {
      result.success = false;
      result.message = "El device debe ser un valor valido.";
      res.statusCode = 400;
    }
  }
  else {
    result.success = false;
    result.message = "El device es obligatorio.";
    res.statusCode = 400;
  }
  res.send(result)
});