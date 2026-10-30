/// <reference types="node" />
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

type PushResponse = {
  data?: { status?: string; id?: string; details?: { error?: string } };
};

const input = createInterface({ input: stdin, output: stdout });
const token = (await input.question("Expo push token: ")).trim();
input.close();

if (!/^(ExponentPushToken|ExpoPushToken)\[[^\]\s]+\]$/.test(token)) {
  console.error("Enter a complete Expo push token.");
  process.exitCode = 1;
} else {
  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        to: token,
        title: "Test notification",
        body: "Hello from Expo Push!",
      }),
    });
    const result = (await response.json()) as PushResponse;
    if (!response.ok || result.data?.status !== "ok") {
      console.error(
        "Push request failed:",
        result.data?.details?.error ?? `HTTP ${response.status}`,
      );
      process.exitCode = 1;
    } else {
      console.log("Expo accepted the request. Ticket ID:", result.data.id);
      console.log("Acceptance does not confirm delivery.");
    }
  } catch {
    console.error("Push request failed. Check your network connection.");
    process.exitCode = 1;
  }
}
