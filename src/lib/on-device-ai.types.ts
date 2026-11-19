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

export const llamaModel = {
  id: "ggml-org/Qwen3.5-4B-GGUF/Qwen3.5-4B-Q4_K_M.gguf",
  name: "Qwen3.5-4B",
  downloadSize: "3.03 GB",
  sizeBytes: 3_032_091_584,
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
    detail: `${llamaModel.name} · Q4_K_M GGUF · ${llamaModel.downloadSize}`,
  },
  {
    id: "mlc",
    label: "MLC",
    detail: "Qwen / Llama · compiled runtime · starts around 600 MB",
  },
];
