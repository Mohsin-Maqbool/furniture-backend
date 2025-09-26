const app = require("./api/index");
const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
