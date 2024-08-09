const app = require("./src/app");
const port = 3000;
// Express Routes

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
