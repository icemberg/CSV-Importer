require("dotenv").config({ path: ".env" });
const { extractCrmRecords } = require("./src/services/ai.service");
const { parseCSV } = require("./src/services/csv.service");
const fs = require("fs");

async function test() {
  try {
    const csvContent = fs.readFileSync("../sample-csvs/facebook_leads.csv", "utf8");
    const { headers, records } = parseCSV(csvContent);
    console.log("Parsed records:", records.length);
    const result = await extractCrmRecords(headers, records);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
