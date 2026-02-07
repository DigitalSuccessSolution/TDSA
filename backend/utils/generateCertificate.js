const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// FIXED ARGUMENTS: Matches the Controller call order exactly
module.exports = (
  studentName,
  courseName,
  testDate,
  mentorName,
  certificateNumber
) => {
  return new Promise((resolve, reject) => {
    try {
      // 1. Setup Document
      const doc = new PDFDocument({
        layout: "landscape",
        size: "A4", // 841.89 x 595.28 points
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        bufferPages: true,
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // 2. Load Template Image
      const assetsDir = path.join(__dirname, "../assets");
      let templatePath = path.join(assetsDir, "Template.png");

      if (!fs.existsSync(templatePath)) {
        templatePath = path.join(assetsDir, "Template.jpeg");
      }
      if (!fs.existsSync(templatePath)) {
        templatePath = path.join(assetsDir, "Template.jpg");
      }

      if (fs.existsSync(templatePath)) {
        doc.image(templatePath, 0, 0, {
          width: doc.page.width,
          height: doc.page.height,
        });
      } else {
        doc.rect(0, 0, doc.page.width, doc.page.height).fill("#001835");
      }

      // 3. Fonts & Colors
      const TEXT_COLOR = "#FFFFFF";

      // --- PREPARE DATA ---
      const displayDate = testDate || new Date().toLocaleDateString();

      // --- DYNAMIC CONTENT ---

      // A. Student Name (Centered)
      doc
        .font("Times-BoldItalic")
        .fontSize(48)
        .fillColor(TEXT_COLOR)
        .text(studentName, 0, 250, {
          align: "center",
          width: doc.page.width,
        });

      // B. Course Name (Line 1) - Thoda upar shift kiya (Y=340)
      doc
        .font("Times-BoldItalic")
        .fontSize(28)
        .fillColor(TEXT_COLOR)
        .text(courseName, 0, 355, {
          align: "center",
          width: doc.page.width,
        });

      // C. Academy Name + Date (Line 2) - Isko neeche rakha (Y=380)
      doc
        .font("Times-BoldItalic") // Font same rakha hai ya aap chaho to 'Helvetica' kar sakte ho normal ke liye
        .fontSize(22) // Font size thoda chhota kiya taki hierarchy dikhe
        .fillColor(TEXT_COLOR)
        .text(`from The Data Science Academy on ${displayDate}.`, 0, 380, {
          align: "center",
          width: doc.page.width,
        });

      // --- FOOTER ---
      const footerY = 480;

      // D. Real Mentor Name (Bottom Right)
      const displayMentor = mentorName || "Shivangini Gupta";
      const rightSideX = doc.page.width - 350;

      doc.font("Helvetica-BoldOblique").fontSize(20).fillColor(TEXT_COLOR);

      doc.text(displayMentor, rightSideX, footerY - 5, {
        width: 250,
        align: "center",
      });

      // Label
      doc.font("Helvetica").fontSize(10).fillColor("#CCCCCC");
      doc.text("Mentor / Trainer", rightSideX, footerY + 25, {
        width: 250,
        align: "center",
      });

      // E. Certificate Number (Bottom Left)
      // Added as per user request
      const certID = certificateNumber || "TDSA-Preview";
      const leftSideX = 50;

      doc.font("Helvetica-Bold").fontSize(12).fillColor("#CCCCCC"); // Light gray for ID

      doc.text(`Certificate ID: ${certID}`, leftSideX, footerY + 25, {
        width: 250,
        align: "left", // Left aligned
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
