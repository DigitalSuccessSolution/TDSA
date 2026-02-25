const LOGO_URL = "http://tdsacad.com/images/tdsalogo-wbg.png";
const BRAND_COLOR = "#2563EB";
const ACCENT_COLOR = "#f4f4f4";

// Helper for consistent buttons
const renderButton = (text, url = "#") => `
  <div style="text-align: center; margin: 30px 0;">
    <a href="${url}" style="background-color: ${BRAND_COLOR}; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
      ${text}
    </a>
  </div>
`;

// Main Wrapper Function
const wrapHtml = (title, content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: ${ACCENT_COLOR}; color: #333;">
      <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <div style="padding: 40px 30px;">
          <h2 style="color: ${BRAND_COLOR}; margin-top: 0; font-size: 24px; text-align: center;">${title}</h2>
          <div style="font-size: 16px; line-height: 1.6; color: #555;">
            ${content}
          </div>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} TDSA Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// 1. Templates for USERS
// 1. Templates for USERS
const userTemplates = {
  // 1. Enrollment
  enrollment: (user, data) =>
    wrapHtml(
      "You’re In! Welcome to The Data Science Academy",
      `
      
      <p>Dear Learners,</p> 
      <p>Welcome to The Data Science Academy – where your future in data begins today!</p> 
      <p>We’re thrilled to have you join our community of innovators, problem-solvers, and future leaders in tech. This isn’t just another course – it’s your launchpad into one of the most in-demand fields worldwide. Over the coming weeks, you’ll gain practical, industry-relevant skills, work on real-world projects, and connect with a network of passionate learners and mentors.</p> 
      <p>Keep an eye on your inbox for exclusive updates on course materials, schedules, and resources designed to give you a competitive edge. And remember, our support team is always here to help you stay on track and make the most of your learning journey.</p> 
      <p>Get ready to challenge yourself, unlock new opportunities, and transform your career with data science.</p> 
      <p>Here’s to your success!</p> 
      <p>Best regards,<br>The Data Science Academy Team</p>
      ${renderButton("Go to Dashboard", "http://tdsacad.com")}
    `,
    ),

  // 2. Quiz Notification
  quiz_notification: (user, data) =>
    wrapHtml(
      `New Quiz Added to Your Course – ${data.courseName}`,
      `

       <p>Dear Learners,</p> 
       <p>We are pleased to inform you that a new quiz has been added to your course  ${data.courseName} by the faculty.</p> 
       <p>This quiz is designed to help you reinforce your understanding of the material and assess your progress.</p> 
       <p>Please log in to your course portal to access the quiz and review the instructions carefully. Be mindful of the submission deadline and ensure you complete the quiz within the allotted time.</p> 
       <p>If you have any questions or require assistance, please reach out to your faculty for academic guidance or contact The Data Science Academy support team for technical and administrative help.</p> 
       <p>We wish you the very best in your preparation and look forward to your continued success.</p> 
       <p>Best Regards,<br>The Data Science Academy Team</p>
       ${renderButton("Take Quiz", "http://tdsacad.com")}
    `,
    ),

  // 3. Lecture Link Notification
  lecture_link_notification: (user, data) =>
    wrapHtml(
      "Exciting Update: New Lecture Link Added to Your Course",
      `
       <p><strong>Subject: Exciting Update: New Lecture Link Added to Your Course</strong></p> 
       <p>Dear Learners,</p> 
       <p>Exciting news! A new lecture link has just been added to your course by the faculty.</p> 
       <p>This lecture is designed to enrich your learning experience and provide deeper insights into the subject matter.</p> 
       <p>Please log in to your course portal to access the lecture link and review the details. Be sure to check the schedule and accompanying resources so you can make the most of this opportunity.</p> 
       <p>If you have any questions or need assistance, please reach out to your faculty for academic guidance or contact The Data Science Academy support team for technical help.</p> 
       <p>We look forward to your active participation and are excited to see your continued progress in the program.</p> 
       <p>Best regards,<br>The Data Science Academy Team</p>
       ${renderButton("View Lecture", "http://tdsacad.com")}
    `,
    ),

  // 4. Certificate Completion
  certificate_completion: (user, data) =>
    wrapHtml(
      "Congratulations on Completing Your Course – Certificate Attached",
      `
       <p><strong>Subject: Congratulations on Completing Your Course – Certificate Attached</strong></p> 
       <p>Dear Learners,</p> 
       <p>Congratulations on successfully completing your course! 🎉</p>
       <p>Your certificate of completion has been issued and is attached to this email. This certificate is a proud recognition of your dedication, perseverance, and the skills you have mastered throughout the program.</p> 
       <p>This milestone marks an exciting step forward in your journey with data science, showcasing your commitment to growth and excellence. We are thrilled to celebrate this achievement with you and look forward to seeing the opportunities your new skills will unlock.</p> 
       <p>If you require any assistance in accessing or using your certificate, please contact your faculty for academic guidance or reach out to The Data Science Academy support team for technical help.</p> 
       <p>Once again, congratulations on this outstanding accomplishment!</p>
       <p>Best Regards,<br>The Data Science Academy Team</p>
    `,
    ),

  // Fallback / Generic Notification (Kept just in case)
  notification: (user, data) =>
    wrapHtml(
      `🔔 Update: ${data.courseName}`,
      `
      <p>Hi <b>${user.name}</b>,</p>
      <p>There is a new update in your course <b>${data.courseName}</b>.</p>
      <div style="background-color: #eff6ff; border-left: 4px solid ${BRAND_COLOR}; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #1e40af; font-weight: bold;">${data.type}</p>
        <p style="margin: 5px 0 0; font-size: 14px; color: #555;">Please log in to check the details.</p>
      </div>
      ${renderButton("Check Update", "http://tdsacad.com")}
    `,
    ),

  // 5. Forgot Password OTP
  forgot_password: (user, data) =>
    wrapHtml(
      "Password Reset OTP",
      `
      <p>Hi <b>${user.name}</b>,</p>
      <p>You requested to reset your password. Use the OTP below to proceed:</p>
      <div style="background-color: #eff6ff; border-left: 4px solid ${BRAND_COLOR}; padding: 15px; margin: 20px 0; text-align: center;">
        <h2 style="margin: 0; color: #1e40af; letter-spacing: 5px;">${data.otp}</h2>
        <p style="margin: 5px 0 0; font-size: 14px; color: #555;">This OTP is valid for 60 Seconds.</p>
      </div>
      <p>If you did not request this, please ignore this email.</p>
    `,
    ),
};

const subjects = {
  enrollment: (data) => "You’re In! Welcome to The Data Science Academy",
  quiz_notification: (data) =>
    `New Quiz Added to Your Course – ${data.courseName}`,
  lecture_link_notification: (data) =>
    "Exciting Update: New Lecture Link Added to Your Course",
  certificate_completion: (data) =>
    "Congratulations on Completing Your Course – Certificate Attached",
  registration: (data) => "Welcome to TDSA!",
  forgot_password: (data) => "Password Reset OTP",
};

module.exports = { userTemplates, subjects };
