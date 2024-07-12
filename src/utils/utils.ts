import { ActivityType } from "discord.js";

export const getType = (type: ActivityType | String) => {
    switch (type) {
      case "COMPETING":
        return ActivityType.Competing;

      case "LISTENING":
        return ActivityType.Listening;

      case "PLAYING":
        return ActivityType.Playing;

      case "WATCHING":
        return ActivityType.Watching;

      case "STREAMING":
        return ActivityType.Streaming;
    }
  };