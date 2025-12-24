import twilio from "twilio";

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error("Missing Twilio credentials in environment variables");
}

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const getTwilioPhoneNumber = () => {
  if (!process.env.TWILIO_PHONE_NUMBER) {
    throw new Error("Missing TWILIO_PHONE_NUMBER in environment variables");
  }
  return process.env.TWILIO_PHONE_NUMBER;
};
