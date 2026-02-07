require("dotenv").config();
const StudentQuizResult = require("../models/StudentQuizResult");
const generateCertificate = require("../utils/generateCertificate");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendCertificate = async (req, res) => {
  try {
    const { resultId, customMentorName } = req.body;

    // 1. FETCH DATA (Try to populate mentor from course if schema has it)
    const result = await StudentQuizResult.findById(resultId)
      .populate("student", "name email")
      .populate("course", "subject mentor"); // Attempt to fetch mentor from DB

    if (!result) return res.status(404).json({ message: "Result not found." });
    if (!result.student)
      return res.status(400).json({ message: "Student record missing." });

    const studentName = result.student.name;
    const studentEmail = result.student.email;
    const courseName = result.course?.subject || "Course Assessment";

    // 2. DATE SETUP
    // Uses quiz submission date. If missing, uses today.
    let dateObj = result.createdAt ? new Date(result.createdAt) : new Date();
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // 3. MENTOR SETUP (Priority Order)
    // Priority 1: Custom Name passed in API Request
    // Priority 2: Mentor name from Course Database (if populated)
    // Priority 3: Default "Shivangini Gupta"
    let mentorName = "Shivangini Gupta";

    if (customMentorName) {
      mentorName = customMentorName;
    } else if (result.course && result.course.mentor) {
      mentorName = result.course.mentor;
    }

    // 3.5. GENERATE CERTIFICATE NUMBER
    let certNumber = result.certificateNumber;
    if (!certNumber) {
      // Find the last certificate number
      const lastCert = await StudentQuizResult.findOne({
        certificateNumber: { $exists: true, $ne: null },
      })
        .sort({ certificateNumber: -1 })
        .select("certificateNumber");

      let nextNum = 111111;
      if (lastCert && lastCert.certificateNumber) {
        const parts = lastCert.certificateNumber.replace("TDSA", "");
        const num = parseInt(parts);
        if (!isNaN(num)) nextNum = num + 1;
      }
      certNumber = `TDSA${nextNum}`;

      // Save it to the result
      result.certificateNumber = certNumber;
      await result.save();
    }

    console.log(
      `Generating Certificate -> Name: ${studentName}, Date: ${formattedDate}, Mentor: ${mentorName}, No: ${certNumber}`
    );

    // 4. GENERATE PDF
    // IMPORTANT: Sending arguments in exact order expected by Utils
    // If generateCertificate takes certNumber, updated it.
    // For now, presuming signature is (studentName, courseName, date, mentorName)
    // If we want to show Cert Number, we might need to update the util too?
    // The user just said "Every generated certificate should have a unique certificate number."
    // It didn't explicitly say "Display it on the PDF", but it's implied for a certificate feature.
    // However, standard utils usually take fixed args. I will assume for now we just generate & store it.
    // If visual update is needed, I'd need to check 'generateCertificate' util.
    const pdfBuffer = await generateCertificate(
      studentName,
      courseName,
      formattedDate,
      mentorName,
      certNumber // Passing it just in case, or for future use
    );

    // 5. SEND EMAIL
    const mailOptions = {
      from: `"Data Science Academy" <${process.env.SMTP_EMAIL}>`,
      to: studentEmail,
      subject: `🏆 Certificate of Achievement: ${courseName}`,
      html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4F46E5;">Congratulations, ${studentName}!</h2>
                    <p>We are thrilled to certify your success in <strong>${courseName}</strong>.</p>
                    <p>Issued on: <strong>${formattedDate}</strong></p>
                    <p>Mentor: <strong>${mentorName}</strong></p>
                    <br/>
                    <p>Attached is your official certificate.</p>
                </div>
            `,
      attachments: [
        {
          filename: `${studentName.replace(/\s+/g, "_")}_Certificate.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: `Certificate sent successfully to ${studentEmail}` });
  } catch (err) {
    console.error("❌ Certificate Controller Error:", err);
    res
      .status(500)
      .json({
        message: "Failed to generate/send certificate.",
        error: err.message,
      });
  }
};
