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

app.get("/hi", async (req, res) => {
  res.send("Hola mundo!");
});

app.get("/version", async (req, res) => {
  res.send({ version: "IQ-Coffee, version 0.0.2!" });
});

app.listen(port, () => {
  console.log(`Example app. listening at http://localhost:${port}`);
});


app.post("/sensor", async (req, res) => {
  var result = { success: false, message: "", data: {} }
  let dev = req.body.device;
  let t1 = req.body.temp1;
  let t2 = req.body.temp2;
  let t3 = req.body.temp3;
  let t4 = req.body.temp4;
  let t5 = req.body.temp5;
  let timestamp = req.body.timestamp;
  if (dev !== null){
    result.success = true;
    result.message = 'El device '+ dev+ ' midio las temperaturas el dia '+ timestamp;
  }
  else
  {
    result.success = false;
    result.message = "El device es obligatorio";
  }
  res.send(result)
});