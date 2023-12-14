import OtpModel from "../models/otp.model";

const cleanupDatabase = async (): Promise<void> => {
  try {
    const result = await OtpModel.updateMany(
      { "passwords.expiresAt": { $lt: new Date() } },
      { $pull: { passwords: { expiresAt: { $lt: new Date() } } } },
      { multi: true }
    );
  } catch (error) {
    console.error("Error during database cleanup:", error);
  }
};

export default cleanupDatabase;