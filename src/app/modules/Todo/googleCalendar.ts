// import { calendar, ensureAuthenticated } from "./googleAuth";
import { ITodo } from "./todo.interface";
import { calendar, ensureAuthenticated } from "./todo.utils";

export const createGoogleEvent = async (userId: string, todo: ITodo) => {
  await ensureAuthenticated(userId);

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

export const updateGoogleEvent = async (userId: string, todo: ITodo) => {
  await ensureAuthenticated(userId);

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

export const deleteGoogleEvent = async (userId: string, eventId: string) => {
  await ensureAuthenticated(userId);

  await calendar.events.delete({ calendarId: "primary", eventId });
};
