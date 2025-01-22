import cron from "node-cron";
import WorkshopModel from "../models/workshopModel";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  try {
    await WorkshopModel.updateMany(
      { dateTime: { $lte: now }, status: "upcoming" },
      { $set: { status: "running" } }
    );

    await WorkshopModel.updateMany(
      {
        status: "running",
        $expr: {
          $lte: [
            { $add: ["$dateTime", { $multiply: ["$duration", 3600000] }] },
            now,
          ],
        },
      },
      { $set: { status: "past" } }
    );

    console.log("Workshop statuses updated");
  } catch (err) {
    console.error("Error updating workshop statuses:", err);
  }
});
