import yahooFinance from "yahoo-finance2";
import { parse } from "json2csv";
import * as fs from "fs";
import * as os from "os";

const args = process.argv.slice(2);

// Get the user's home directory
const homeDirectory = os.homedir();
const ticker = "AAPL";

function oneYearAgo(): Date {
  let d = new Date(0);
  d.setUTCMilliseconds(Date.now() - 31104000000); // 12m * 30 d/m *24hr/d * 60m/hr * 60s/m
  return d;
}

// get historical data from today to one year ago
const response = await yahooFinance.historical(args[0], {
  period1: oneYearAgo(),
  interval: "1d",
});

// write json object as csv to file
// Define the fields (CSV columns)
const fields = ["date", "high", "volume", "open", "low", "close", "adjClose"];
try {
  // Convert JSON to CSV
  const csv = parse(response, { fields });

  // Write CSV to a file
  const filename = `${homeDirectory}/Desktop/${ticker}_${response[0].date.toISOString()}_${response[response.length - 1].date.toISOString()}.csv`;
  fs.writeFileSync(filename, csv);

  console.log(`CSV file successfully written to ${filename}`);
} catch (err) {
  console.error("Error writing CSV file:", err);
}
