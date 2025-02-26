"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoogleEvent = exports.updateGoogleEvent = exports.createGoogleEvent = void 0;
const googleapis_1 = require("googleapis");
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
const calendar = googleapis_1.google.calendar({ version: "v3", auth: oauth2Client });
const createGoogleEvent = (todo) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield calendar.events.insert({
        calendarId: "primary",
        requestBody: {
            summary: todo.title,
            description: todo.description,
            start: { dateTime: todo.dueDate.toISOString() },
            end: { dateTime: todo.dueDate.toISOString() },
        },
    });
    return event.data.id;
});
exports.createGoogleEvent = createGoogleEvent;
const updateGoogleEvent = (todo) => __awaiter(void 0, void 0, void 0, function* () {
    yield calendar.events.update({
        calendarId: "primary",
        eventId: todo.googleEventId,
        requestBody: {
            summary: todo.title,
            description: todo.description,
            start: { dateTime: todo.dueDate.toISOString() },
            end: { dateTime: todo.dueDate.toISOString() },
        },
    });
});
exports.updateGoogleEvent = updateGoogleEvent;
const deleteGoogleEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    yield calendar.events.delete({ calendarId: "primary", eventId });
});
exports.deleteGoogleEvent = deleteGoogleEvent;
