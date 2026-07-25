export type OnDeviceAIRuntime = "apple" | "llama" | "mlc";

export type OnDeviceAIRuntimeOption = {
  id: OnDeviceAIRuntime;
  label: string;
  detail: string;
};

export type OnDeviceAIStatus = {
  ready: boolean;
  canPrepare: boolean;
  label: string;
  description: string;
  actionLabel?: string;
};

export type OnDeviceAIProgress = {
  phase: "downloading" | "preparing";
  label: string;
  percentage?: number;
};

export type OnDeviceAIGenerationOptions = {
  maxOutputTokens: number;
  temperature: number;
};

export const onDeviceAIRuntimes: OnDeviceAIRuntimeOption[] = [
  {
    id: "apple",
    label: "Apple",
    detail: "Foundation Models · no download",
  },
  {
    id: "llama",
    label: "Llama",
    detail: "Llama 3.2 1B · GGUF · about 808 MB",
  },
  {
    id: "mlc",
    label: "MLC",
    detail: "Qwen / Llama · compiled runtime · starts around 600 MB",
  },
];
