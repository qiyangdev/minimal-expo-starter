import {
  type OnDeviceAIGenerationOptions,
  type OnDeviceAIProgress,
  type OnDeviceAIRuntime,
  type OnDeviceAIStatus,
} from "./on-device-ai.types";

export * from "./on-device-ai.types";

export async function getOnDeviceAIStatus(
  _runtime: OnDeviceAIRuntime,
): Promise<OnDeviceAIStatus> {
  return {
    ready: false,
    canPrepare: false,
    label: "Native mobile build required",
    description:
      "This local AI example is available in the iOS and Android development builds.",
  };
}

export async function prepareOnDeviceAIRuntime(
  _runtime: OnDeviceAIRuntime,
  _onProgress?: (progress: OnDeviceAIProgress) => void,
): Promise<OnDeviceAIStatus> {
  throw new Error("Local models are only available in native mobile builds.");
}

export async function generateOnDeviceText(
  _runtime: OnDeviceAIRuntime,
  _prompt: string,
  _options: OnDeviceAIGenerationOptions,
  _onDelta?: (text: string) => void,
): Promise<string> {
  throw new Error("Local models are only available in native mobile builds.");
}

export async function unloadOnDeviceAIRuntime(
  _runtime: OnDeviceAIRuntime,
): Promise<void> {}
