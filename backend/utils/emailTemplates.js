const LOGO_URL = "https://tdsa-lime.vercel.app/images/tdsalogo-wbg.png"; 
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
const userTemplates = {
  
  // Single User: Enrollment
  enrollment: (user, data) => wrapHtml(
    "Welcome to Your New Course! 🎉",
    `
      <p>Hi <b>${user.name}</b>,</p>
      <p>Congratulations! You have successfully enrolled in <b>${data.courseName}</b>.</p>
      <p>You can access your study materials and lectures immediately.</p>
      ${renderButton("Go to Dashboard", "https://tdsa-lime.vercel.app/dashboard")}
    `
  ),

  // Single User: Registration
  registration: (user, data) => wrapHtml(
    "Welcome to TDSA! 👋",
    `
      <p>Hi <b>${user.name}</b>,</p>
      <p>Thank you for joining TDSA Platform. Your account has been created successfully.</p>
      ${renderButton("Login Now", "https://tdsa-lime.vercel.app/login")}
    `
  ),

  // Bulk Users: Notifications (Quiz, Class, Links)
  notification: (user, data) => wrapHtml(
    `🔔 Update: ${data.courseName}`,
    `
      <p>Hi <b>${user.name}</b>,</p>
      <p>There is a new update in your course <b>${data.courseName}</b>.</p>
      
      <div style="background-color: #eff6ff; border-left: 4px solid ${BRAND_COLOR}; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #1e40af; font-weight: bold;">${data.type}</p>
        <p style="margin: 5px 0 0; font-size: 14px; color: #555;">Please log in to check the details.</p>
      </div>

      ${renderButton("Check Update", "https://tdsa-lime.vercel.app/dashboard")}
    `
  )
};

module.exports = { userTemplates };