import {
  generateOnDeviceText,
  getOnDeviceAIStatus,
  onDeviceAIRuntimes,
  prepareOnDeviceAIRuntime,
  unloadOnDeviceAIRuntime,
  type OnDeviceAIGenerationOptions,
  type OnDeviceAIProgress,
  type OnDeviceAIRuntime,
  type OnDeviceAIStatus,
} from "@/lib/on-device-ai";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const checkingStatus: OnDeviceAIStatus = {
  ready: false,
  canPrepare: false,
  label: "Checking model…",
  description: "Looking for an available on-device runtime.",
};
const defaultRuntime: OnDeviceAIRuntime = "apple";

type OnDeviceAISettings = {
  runtime: OnDeviceAIRuntime;
  runtimeLabel: string;
  status: OnDeviceAIStatus;
  error: string;
  isGenerating: boolean;
  isPreparing: boolean;
  progress: OnDeviceAIProgress | null;
  selectRuntime: (runtime: OnDeviceAIRuntime) => Promise<void>;
  prepareRuntime: () => Promise<void>;
  generate: (
    prompt: string,
    options: OnDeviceAIGenerationOptions,
    onDelta?: (text: string) => void,
  ) => Promise<string>;
};

const OnDeviceAISettingsContext = createContext<OnDeviceAISettings | null>(
  null,
);

export function OnDeviceAISettingsProvider({
  children,
}: PropsWithChildren) {
  const [runtime, setRuntime] =
    useState<OnDeviceAIRuntime>(defaultRuntime);
  const [status, setStatus] = useState(checkingStatus);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [progress, setProgress] = useState<OnDeviceAIProgress | null>(null);

  useEffect(() => {
    let active = true;

    getOnDeviceAIStatus(defaultRuntime).then((nextStatus) => {
      if (active) {
        setStatus(nextStatus);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  async function selectRuntime(nextRuntime: OnDeviceAIRuntime) {
    if (nextRuntime === runtime || isGenerating || isPreparing) {
      return;
    }

    const nextRuntimeLabel =
      onDeviceAIRuntimes.find((option) => option.id === nextRuntime)?.label ??
      "local model";

    setStatus({
      ready: false,
      canPrepare: false,
      label: `Loading ${nextRuntimeLabel}…`,
      description:
        "Checking local files and preparing the selected runtime.",
    });
    setError("");
    setProgress(null);
    setIsPreparing(true);
    setRuntime(nextRuntime);

    try {
      try {
        await unloadOnDeviceAIRuntime(runtime);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The previous local model could not be unloaded cleanly.",
        );
      }

      const nextStatus = await prepareOnDeviceAIRuntime(
        nextRuntime,
        setProgress,
      );
      setStatus(nextStatus);
      setProgress(null);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The selected local model could not be loaded.",
      );
      setStatus(await getOnDeviceAIStatus(nextRuntime));
    } finally {
      setIsPreparing(false);
    }
  }

  async function prepareRuntime() {
    if (!status.canPrepare || isPreparing || isGenerating) {
      return;
    }

    setError("");
    setProgress(null);
    setIsPreparing(true);

    try {
      const nextStatus = await prepareOnDeviceAIRuntime(runtime, setProgress);
      setStatus(nextStatus);
      setProgress(null);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The local model could not be prepared.",
      );
      setStatus(await getOnDeviceAIStatus(runtime));
    } finally {
      setIsPreparing(false);
    }
  }

  async function generate(
    prompt: string,
    options: OnDeviceAIGenerationOptions,
    onDelta?: (text: string) => void,
  ) {
    if (isGenerating || isPreparing) {
      return "";
    }

    setIsGenerating(true);

    try {
      return await generateOnDeviceText(runtime, prompt, options, onDelta);
    } finally {
      setIsGenerating(false);
    }
  }

  const runtimeLabel =
    onDeviceAIRuntimes.find((option) => option.id === runtime)?.label ??
    "Local";

  return (
    <OnDeviceAISettingsContext
      value={{
        runtime,
        runtimeLabel,
        status,
        error,
        isGenerating,
        isPreparing,
        progress,
        selectRuntime,
        prepareRuntime,
        generate,
      }}
    >
      {children}
    </OnDeviceAISettingsContext>
  );
}

export function useOnDeviceAISettings() {
  const settings = useContext(OnDeviceAISettingsContext);

  if (!settings) {
    throw new Error(
      "useOnDeviceAISettings must be used inside OnDeviceAISettingsProvider.",
    );
  }

  return settings;
}
