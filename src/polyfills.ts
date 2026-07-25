import { Platform } from "react-native";
import structuredClone from "@ungap/structured-clone";

async function installPolyfills() {
  if (Platform.OS === "web") {
    return;
  }

  const [{ polyfillGlobal }, { TextDecoderStream, TextEncoderStream }] =
    await Promise.all([
      import("react-native/Libraries/Utilities/PolyfillFunctions"),
      import("@stardazed/streams-text-encoding"),
    ]);

  if (!("structuredClone" in globalThis)) {
    polyfillGlobal("structuredClone", () => structuredClone);
  }

  polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
  polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
}

export const polyfillsReady = installPolyfills();
