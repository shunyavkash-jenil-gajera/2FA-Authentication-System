import app from "./app.js";
import { PORT } from "./config/environment.config.js";
import { connectDB } from "./config/connectDB.js";

// Connect data base
connectDB();

app.listen(PORT, async () => {
  console.log(`server is listening on port ${PORT}`);
  console.log("test");
});

export default app;
