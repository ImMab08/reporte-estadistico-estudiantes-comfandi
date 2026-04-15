const xlsx = require('xlsx');
const path = "C:\\Users\\Asus-PC\\Downloads\\NOTAS SEGUNDO PERIODO.xlsx";

try {
  const workbook = xlsx.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  
  console.log("COLUMNS FOUND:");
  console.log(Object.keys(data[0] || {}).join(", "));
  console.log("\nSAMPLE DATA (ROW 1):");
  console.log(JSON.stringify(data[0], null, 2));
} catch (e) {
  console.error("Error reading file:", e.message);
}
