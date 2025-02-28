import { google } from "googleapis";
import { ITodo } from "./todo.interface";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = ["https://www.googleapis.com/auth/calendar"];

// 🔹 Ensure access & refresh tokens are set
oauth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// 🔹 Function to Refresh Access Token Automatically
const refreshAccessToken = async () => {
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    console.log(
      "🔄 Access token refreshed successfully:",
      credentials.access_token
    );
  } catch (error) {
    console.error("❌ Error refreshing access token:", error);
  }
};

// 🔹 Function to Ensure Auth is Valid Before API Calls
const ensureAuthenticated = async () => {
  const tokenInfo = await oauth2Client.getAccessToken();
  if (!tokenInfo.token) {
    console.log("⚠️ Access token missing. Refreshing...");
    await refreshAccessToken();
  }
};

// 🔹 Google Calendar API Client
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export const createGoogleEvent = async (todo: ITodo) => {
  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: todo.title,
      description: todo.description,
      start: { dateTime: todo.startDate.toISOString() },
      end: { dateTime: todo.endDate.toISOString() },
    },
  });
  return event.data.id;
};

export const updateGoogleEvent = async (todo: ITodo) => {
  await calendar.events.update({
    calendarId: "primary",
    eventId: todo.googleEventId as string,
    requestBody: {
      summary: todo.title,
      description: todo.description,
      start: { dateTime: todo.startDate.toISOString() },
      end: { dateTime: todo.endDate.toISOString() },
    },
  });
};

export const deleteGoogleEvent = async (eventId: string) => {
  await calendar.events.delete({ calendarId: "primary", eventId });
};
