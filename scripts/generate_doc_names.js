import fs from "fs";
import path from "path";

const dirPath = path.join("./", "public", "community_docs");
const outputPath = path.join(dirPath, "all_doc_ids.txt");

const excludeFiles = ["all_doc_ids.txt", "template.md", "tutorial.md", "README.md"];

const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md") && !excludeFiles.includes(f));

fs.writeFileSync(outputPath, files.join("\n"));

console.log("[✔] Generated community_docs_metadata.json");
