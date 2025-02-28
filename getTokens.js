const { google } = require("googleapis");
const readlineSync = require("readline-sync");
require("dotenv").config();

dotenv.config();
// Replace these with your credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/calendar"],
});

console.log("Authorize this app by visiting this URL:", authUrl);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Get the authorization code from the user
rl.question("Enter the code from that page here: ", async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);
    console.log("Save these tokens in your .env file.");
  } catch (error) {
    console.error("Error retrieving tokens:", error);
  }
  rl.close();
});
