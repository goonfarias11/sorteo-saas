import { readFileSync } from "node:fs";

const files = ["index.html", "styles.css", "app.js", "server.mjs"];

for (const file of files) {
  const content = readFileSync(file, "utf8");

  if (!content.trim()) {
    throw new Error(`${file} esta vacio`);
  }
}

console.log("Chequeo basico correcto.");
