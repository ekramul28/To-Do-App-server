import { google } from "googleapis";
import dotenv from "dotenv";
import { User } from "../User/user.model";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// 🔹 Function to Get User Tokens from Database
const getUserTokens = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  return {
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  };
};

// 🔹 Function to Set User Tokens in OAuth Client
const setUserCredentials = async (userId: string) => {
  const tokens = await getUserTokens(userId);
  console.log("tokennnnn", tokens);
  oauth2Client.setCredentials({
    access_token: tokens.accessToken as string,
    refresh_token: tokens.refreshToken as string,
  });
};

// 🔹 Refresh Access Token and Update in Database
const refreshAccessToken = async (userId: string) => {
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    await User.findByIdAndUpdate(userId, {
      accessToken: credentials.access_token,
    });

    oauth2Client.setCredentials(credentials);
    console.log(
      " Access token refreshed successfully:",
      credentials.access_token
    );
  } catch (error) {
    console.error(" Error refreshing access token:", error);
  }
};

// 🔹 Ensure Authentication is Valid Before API Calls
const ensureAuthenticated = async (userId: string) => {
  await setUserCredentials(userId);
  const tokenInfo = await oauth2Client.getAccessToken();

  if (!tokenInfo.token) {
    console.log("Access token missing. Refreshing...");
    await refreshAccessToken(userId);
  }
};

// 🔹 Google Calendar API Client
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export { oauth2Client, ensureAuthenticated, calendar };
