require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const connectDB = require("./config/db");
const Email = require("./models/Email");

const app = express();
app.use(express.json());
app.use(cors());

connectDB(); // Connect to MongoDB

// Load Routes
const webhookRoutes = require("./routes/webhook");
app.use("/webhook", webhookRoutes);

const emailRoutes = require("./routes/email");
app.use("/api/emails", emailRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Onebox Email Aggregator API is running...");
});

const imap = new Imap({
  user: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.IMAP_HOST,
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }, // Disable SSL verification
});

function categorizeEmail(email) {
    const subject = email.subject.toLowerCase();
  
    if (subject.includes("spam") || subject.includes("offer") || subject.includes("lottery")) {
      return "Spam";
    }
    if (subject.includes("out of office") || subject.includes("vacation") || subject.includes("leave")) {
      return "Out of Office";
    }
    return "Inbox";
  }
  
  function fetchEmails() {
    imap.connect();
  
    imap.once("ready", function () {
      imap.openBox("INBOX", false, (err, box) => {
        if (err) {
          console.error("❌ Error opening INBOX:", err);
          return;
        }
  
        imap.search(["UNSEEN"], (err, results) => {
          if (err) {
            console.error("❌ Error searching emails:", err);
            return;
          }
          if (!results || results.length === 0) {
            console.log("📭 No new emails.");
            imap.end();
            return;
          }
  
          const fetch = imap.fetch(results, { bodies: "" });
  
          fetch.on("message", function (msg, seqno) {
            msg.on("body", function (stream, info) {
              simpleParser(stream, async (err, parsed) => {
                if (err) {
                  console.error("❌ Error parsing email:", err);
                  return;
                }
  
                const category = categorizeEmail(parsed); // Categorize email
  
                const emailData = {
                  sender: parsed.from.text,
                  subject: parsed.subject,
                  body: parsed.text,
                  receivedAt: new Date(),
                  folder: "INBOX",
                  category: category,
                };
  
                // Save email in MongoDB
                try {
                  await Email.create(emailData);
                  console.log(`📩 New ${category} Email: ${parsed.subject}`);
                } catch (dbErr) {
                  console.error("❌ Error saving email:", dbErr);
                }
              });
            });
          });
  
          fetch.once("end", function () {
            console.log("✅ Emails Fetched!");
            imap.end();
          });
        });
      });
    });
  
    imap.on("error", function (err) {
      console.error("IMAP Fetch Error:", err);
    });
  
    imap.on("end", function () {
      console.log("📴 IMAP Connection Ended");
    });
  }
  
  // Fetch emails every 5 minutes
  setInterval(fetchEmails, 5 * 60 * 1000);
  fetchEmails();
  

// Fetch emails every 5 minutes
setInterval(fetchEmails, 5 * 60 * 1000);
fetchEmails();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
