import { google } from "googleapis";
import { ITodo } from "./todo.interface";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

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
