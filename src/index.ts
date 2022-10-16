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
  res.send({ name: "IQ-Coffee", version: "0.1.0" });
});

app.listen(port, () => {
  console.log(`Example app. listening at http://localhost:${port}`);
});


app.post("/sensor", async (req, response) => {
  var result = { success: false, message: "", data: {} }

  const { device_Id, temp_1, temp_2, temp_3, temp_4, temp_ambiente, humedad, timestamp } = req.body;
  if (device_Id != null) {
    if (device_Id != '') {

      pool.query(
        'INSERT INTO sensor(device_Id, temp_1, temp_2, temp_3, temp_4, temp_ambiente, humedad, timestamp) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        [device_Id, temp_1, temp_2, temp_3, temp_4, temp_ambiente, humedad, timestamp],
        (err, res) => {
          if (err) {
            response.statusCode = 400;
            result.message = err.message;
            return;
          }
          result.success = true;
        }
      );
      result.message = 'El device ' + device_Id + ' midio las temperaturas el dia ' + timestamp + '.';
      response.statusCode = 201;
    }
    else {
      result.success = false;
      result.message = "El device debe ser un valor valido.";
      response.statusCode = 400;
    }
  }
  else {
    result.success = false;
    result.message = "El device es obligatorio.";
    response.statusCode = 400;
  }
  response.send(result)
});