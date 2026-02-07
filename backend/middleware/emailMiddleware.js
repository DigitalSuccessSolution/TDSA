const { sendEmail } = require("../services/emailServices");
const { userTemplates } = require("../utils/emailTemplates");

const emailMiddleware = (templateName) => {
  return (req, res, next) => {
    
    // Response client ko jane ke baad ye trigger hoga (Background Process)
    res.on('finish', async () => {
      
      // Sirf successful requests (200-299) par hi email bhejein
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          // Common Data Fetching
          const courseData = res.locals.course || req.body.course || {};
          const finalCourseName = courseData.name || courseData.title || courseData.subject || "Course";

          // ============================================================
          // SCENARIO A: BULK MODE (Faculty Updates - Quiz, Class, Links)
          // ============================================================
          // Controller ne 'recipients' list set ki hai? -> Bulk Mode ON
          if (res.locals.recipients && res.locals.recipients.length > 0) {
            
            console.log(`📢 Bulk Mode: Sending '${templateName}' to ${res.locals.recipients.length} students.`);
            const updateType = res.locals.updateType || "New Update";

            // Parallel Process (Fast)
            await Promise.all(
              res.locals.recipients.map(async (student) => {
                const templatePayload = {
                  courseName: finalCourseName,
                  type: updateType,
                  ...courseData
                };
                
                const html = userTemplates[templateName]?.(student, templatePayload);
                
                if (html) {
                  // Error handling per email taaki ek fail hone par baaki na rukein
                  try {
                    await sendEmail(student.email, `📢 Update: ${updateType}`, html);
                  } catch (e) {
                    console.error(`Failed to send to ${student.email}`);
                  }
                }
              })
            );
            console.log("✅ All bulk emails processing complete.");
            return; // Exit here
          }

          // ============================================================
          // SCENARIO B: SINGLE MODE (Enrollment, Registration)
          // ============================================================
          // Fallback: Controller ne single 'student' ya 'user' set kiya hai
          
          const user = res.locals.student || req.user || req.body.user;
          const email = user?.email || req.body.email;

          if (!email) {
            // Agar email hi nahi hai to ignore karein (Search/Get requests etc)
            return;
          }

          const templatePayload = {
             courseName: finalCourseName,
             ...courseData
          };

          const html = userTemplates[templateName]?.(user, templatePayload);

          if (!html) {
            console.log(`❌ Template '${templateName}' not found.`);
            return;
          }

          await sendEmail(
            email,
            `Notification: ${templateName} - TDSA`,
            html
          );
          console.log(`✅ Single Email sent to ${email} for ${templateName}`);

        } catch (error) {
          console.error("❌ Email Middleware Error:", error.message);
        }
      }
    });

    next();
  };
};

module.exports = { emailMiddleware };