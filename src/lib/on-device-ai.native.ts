import { polyfillsReady } from "@/polyfills";
import type { ModelMessage } from "ai";
import { isDevice } from "expo-device";
import { Platform } from "react-native";

import {
  llamaModel,
  type OnDeviceAIGenerationOptions,
  type OnDeviceAIProgress,
  type OnDeviceAIRuntime,
  type OnDeviceAIStatus,
} from "./on-device-ai.types";

export {
  onDeviceAIRuntimes,
  type OnDeviceAIGenerationOptions,
  type OnDeviceAIProgress,
  type OnDeviceAIRuntime,
  type OnDeviceAIRuntimeOption,
  type OnDeviceAIStatus,
} from "./on-device-ai.types";

const MLC_MODEL_ID =
  Platform.OS === "ios"
    ? "Qwen2.5-0.5B-Instruct"
    : "Qwen2-1.5B-Instruct";

type LlamaModel = ReturnType<
  (typeof import("@react-native-ai/llama"))["llama"]["languageModel"]
>;
type MlcModel = ReturnType<
  (typeof import("@react-native-ai/mlc"))["mlc"]["languageModel"]
>;

let preparedLlamaModel: LlamaModel | null = null;
let preparedMlcModel: MlcModel | null = null;

async function loadAppleProvider() {
  await polyfillsReady;
  return import("@react-native-ai/apple");
}

async function loadLlamaProvider() {
  await polyfillsReady;
  return import("@react-native-ai/llama");
}

async function getLlamaFileSize(path: string): Promise<number | null> {
  const { default: blobUtil } = await import("react-native-blob-util");
  return (await blobUtil.fs.exists(path))
    ? Number((await blobUtil.fs.stat(path)).size)
    : null;
}

async function loadMlcProvider() {
  await polyfillsReady;
  return import("@react-native-ai/mlc");
}

function physicalDeviceStatus(runtime: "Llama" | "MLC"): OnDeviceAIStatus {
  return {
    ready: false,
    canPrepare: false,
    label: `${runtime} requires a physical device`,
    description:
      "The native runtime and downloaded model are not supported in iOS Simulator or Android Emulator.",
  };
}

async function getAppleStatus(): Promise<OnDeviceAIStatus> {
  if (Platform.OS !== "ios") {
    return {
      ready: false,
      canPrepare: false,
      label: "Apple model unavailable",
      description: "Apple Foundation Models are only available on iOS.",
    };
  }

  try {
    const { apple } = await loadAppleProvider();
    const available = apple.isAvailable();

    return available
      ? {
          ready: true,
          canPrepare: false,
          label: "Apple model ready",
          description:
            "Foundation Models is available immediately and keeps prompts on this device.",
        }
      : {
          ready: false,
          canPrepare: false,
          label: "Apple model unavailable",
          description:
            "Requires iOS 26, Apple Intelligence enabled, and a supported device.",
        };
  } catch {
    return {
      ready: false,
      canPrepare: false,
      label: "Apple provider not linked",
      description:
        "Rebuild the native app. Local providers are not available in Expo Go.",
    };
  }
}

async function getLlamaStatus(): Promise<OnDeviceAIStatus> {
  if (!isDevice) {
    return physicalDeviceStatus("Llama");
  }

  if (preparedLlamaModel) {
    return {
      ready: true,
      canPrepare: false,
      label: `${llamaModel.name} ready`,
      description:
        "Loaded through llama.cpp and ready to generate.",
    };
  }

  try {
    const { getModelPath } = await loadLlamaProvider();
    const size = await getLlamaFileSize(getModelPath(llamaModel.id));
    const downloaded = size === llamaModel.sizeBytes;
    const incomplete = size !== null && !downloaded;

    return {
      ready: false,
      canPrepare: true,
      actionLabel: downloaded
        ? `Load ${llamaModel.name}`
        : incomplete
          ? `Download again · ${llamaModel.downloadSize}`
          : `Download ${llamaModel.name} · ${llamaModel.downloadSize}`,
      label: downloaded
        ? `${llamaModel.name} downloaded`
        : incomplete
          ? `${llamaModel.name} download incomplete`
          : `${llamaModel.name} download required`,
      description: downloaded
        ? "The GGUF model is stored on this device. Load it into memory to continue."
        : incomplete
          ? "The cached GGUF file has the wrong size. Download it again before loading."
          : "Download the GGUF model once to run it fully on-device.",
    };
  } catch {
    return {
      ready: false,
      canPrepare: false,
      label: "Llama provider not linked",
      description:
        "Rebuild the native app after installing llama.rn and its model artifacts.",
    };
  }
}

async function getMlcStatus(): Promise<OnDeviceAIStatus> {
  if (!isDevice) {
    return physicalDeviceStatus("MLC");
  }

  if (preparedMlcModel) {
    return {
      ready: true,
      canPrepare: false,
      label: "MLC model ready",
      description: `${MLC_MODEL_ID} is compiled, loaded, and ready to generate.`,
    };
  }

  try {
    const { MLCEngine } = await loadMlcProvider();
    await MLCEngine.getModel(MLC_MODEL_ID);

    return {
      ready: false,
      canPrepare: true,
      actionLabel: "Download or load MLC model · about 600 MB",
      label: "MLC model setup required",
      description:
        "Existing model files are reused. Otherwise the optimized weights are downloaded before loading.",
    };
  } catch {
    return {
      ready: false,
      canPrepare: false,
      label: "MLC provider not linked",
      description:
        "Rebuild the native app. MLC requires the New Architecture and increased-memory entitlement.",
    };
  }
}

export async function getOnDeviceAIStatus(
  runtime: OnDeviceAIRuntime,
): Promise<OnDeviceAIStatus> {
  if (runtime === "apple") {
    return getAppleStatus();
  }
  if (runtime === "llama") {
    return getLlamaStatus();
  }
  return getMlcStatus();
}

async function prepareLlama(
  onProgress?: (progress: OnDeviceAIProgress) => void,
): Promise<void> {
  if (!isDevice) {
    throw new Error("Llama models must be prepared on a physical device.");
  }
  if (preparedLlamaModel) {
    return;
  }

  const { downloadModel, getModelPath, llama, removeModel } =
    await loadLlamaProvider();
  const modelPath = getModelPath(llamaModel.id);
  const size = await getLlamaFileSize(modelPath);

  if (size !== llamaModel.sizeBytes) {
    if (size !== null) {
      await removeModel(llamaModel.id);
    }
    onProgress?.({
      phase: "downloading",
      label: `Downloading ${llamaModel.name}…`,
      percentage: 0,
    });

    try {
      await downloadModel(llamaModel.id, ({ percentage }) => {
        onProgress?.({
          phase: "downloading",
          label: `Downloading ${llamaModel.name}…`,
          percentage: Number.isFinite(percentage) ? percentage : undefined,
        });
      });
      if ((await getLlamaFileSize(modelPath)) !== llamaModel.sizeBytes) {
        throw new Error(`${llamaModel.name} download was incomplete. Try downloading it again.`);
      }
    } catch (error) {
      await removeModel(llamaModel.id).catch(() => undefined);
      throw error;
    }
  }

  onProgress?.({
    phase: "preparing",
    label: `Loading ${llamaModel.name} into memory…`,
  });
  const model = llama.languageModel(modelPath, {
    contextParams: { n_ctx: 2048, n_gpu_layers: 99 },
  });
  try {
    await model.prepare();
    preparedLlamaModel = model;
  } catch (error) {
    await model.unload().catch(() => undefined);
    throw error;
  }
}

async function prepareMlc(
  onProgress?: (progress: OnDeviceAIProgress) => void,
): Promise<void> {
  if (!isDevice) {
    throw new Error("MLC models must be prepared on a physical device.");
  }
  if (preparedMlcModel) {
    return;
  }

  const { mlc } = await loadMlcProvider();
  const model = mlc.languageModel(MLC_MODEL_ID);

  onProgress?.({
    phase: "downloading",
    label: `Checking and downloading ${MLC_MODEL_ID}…`,
    percentage: 0,
  });
  await model.download(({ percentage }) => {
    onProgress?.({
      phase: "downloading",
      label: `Downloading ${MLC_MODEL_ID}…`,
      percentage: Number.isFinite(percentage) ? percentage : undefined,
    });
  });

  onProgress?.({
    phase: "preparing",
    label: "Loading the compiled MLC model into memory…",
  });
  try {
    await model.prepare();
    preparedMlcModel = model;
  } catch (error) {
    await model.unload().catch(() => undefined);
    throw error;
  }
}

export async function prepareOnDeviceAIRuntime(
  runtime: OnDeviceAIRuntime,
  onProgress?: (progress: OnDeviceAIProgress) => void,
): Promise<OnDeviceAIStatus> {
  if (runtime === "apple") {
    return getAppleStatus();
  }

  if (runtime === "llama") {
    await prepareLlama(onProgress);
  } else {
    await prepareMlc(onProgress);
  }

  return getOnDeviceAIStatus(runtime);
}

async function streamFromModel(
  model: Parameters<(typeof import("ai"))["streamText"]>[0]["model"],
  messages: ModelMessage[],
  options: OnDeviceAIGenerationOptions,
  onDelta?: (text: string) => void,
): Promise<string> {
  const { streamText } = await import("ai");
  const result = streamText({
    model,
    system:
      "You are a concise, helpful assistant running privately on the user's device.",
    messages,
    maxOutputTokens: options.maxOutputTokens,
    temperature: options.temperature,
  });

  let text = "";
  for await (const part of result.fullStream) {
    if (part.type === "error") {
      throw part.error;
    }
    if (part.type === "text-delta") {
      text += part.text;
      onDelta?.(text);
    }
  }
  return text;
}

export async function generateOnDeviceText(
  runtime: OnDeviceAIRuntime,
  messages: ModelMessage[],
  options: OnDeviceAIGenerationOptions,
  onDelta?: (text: string) => void,
): Promise<string> {
  if (runtime === "apple") {
    const { apple } = await loadAppleProvider();
    if (!apple.isAvailable()) {
      throw new Error(
        "Apple Foundation Models are unavailable. Check device support and Apple Intelligence settings.",
      );
    }
    return streamFromModel(apple(), messages, options, onDelta);
  }

  if (runtime === "llama") {
    if (!preparedLlamaModel) {
      throw new Error(`Download and load ${llamaModel.name} first.`);
    }
    return streamFromModel(preparedLlamaModel, messages, options, onDelta);
  }

  if (!preparedMlcModel) {
    throw new Error("Download and load the MLC model first.");
  }
  return streamFromModel(preparedMlcModel, messages, options, onDelta);
}

export async function unloadOnDeviceAIRuntime(
  runtime: OnDeviceAIRuntime,
): Promise<void> {
  if (runtime === "llama" && preparedLlamaModel) {
    await preparedLlamaModel.unload();
    preparedLlamaModel = null;
  }

  if (runtime === "mlc" && preparedMlcModel) {
    await preparedMlcModel.unload();
    preparedMlcModel = null;
  }
}
