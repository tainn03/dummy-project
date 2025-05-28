import next from "next";
import { startExpressServer } from "./express-server";
import path from "path";

const dev = process.env.NODE_ENV !== "production";
const dir = path.join(process.cwd());
const port = parseInt(process.env.PORT || "3000", 10);

// Initialize Next.js
async function startNextServer() {
  try {
    const nextApp = next({ dev, dir });
    await nextApp.prepare();
    console.log(
      `✅ Next.js app prepared - running in ${
        dev ? "development" : "production"
      } mode`
    );

    // Start Express server in parallel
    startExpressServer();

    console.log(`> Ready on http://localhost:${port}`);
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startNextServer();
}

export default startNextServer;
