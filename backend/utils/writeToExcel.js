const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/quiz_results.xlsx");

async function writeToExcel(data) {
  const workbook = new ExcelJS.Workbook();

  // file already exist hai? → open karo
  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
  } else {
    // nahi hai → create new excel
    const sheet = workbook.addWorksheet("Results");
    sheet.columns = [
      { header: "Student Name", key: "name", width: 25 },
      { header: "Student ID", key: "studentId", width: 20 },
      { header: "Quiz ID", key: "quizId", width: 20 },
      { header: "Score", key: "score", width: 10 },
      { header: "Total Questions", key: "total", width: 15 },
      { header: "Correct Answers", key: "correct", width: 15 },
      { header: "Date", key: "date", width: 25 },
    ];
  }

  const sheet = workbook.getWorksheet("Results");

  sheet.addRow({
    ...data,
    date: new Date().toLocaleString(),
  });

  await workbook.xlsx.writeFile(filePath);

  console.log("Excel Updated ✓");
}

module.exports = writeToExcel;
