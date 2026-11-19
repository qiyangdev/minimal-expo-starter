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
import type { ModelMessage } from "ai";
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const checkingStatus: OnDeviceAIStatus = {
  ready: false,
  canPrepare: false,
  label: "Checking model…",
  description: "Looking for an available on-device runtime.",
};
const defaultRuntime: OnDeviceAIRuntime = "llama";

type OnDeviceAISettings = {
  runtime: OnDeviceAIRuntime;
  generationOptions: OnDeviceAIGenerationOptions;
  setGenerationOptions: Dispatch<SetStateAction<OnDeviceAIGenerationOptions>>;
  status: OnDeviceAIStatus;
  error: string;
  isGenerating: boolean;
  isPreparing: boolean;
  progress: OnDeviceAIProgress | null;
  selectRuntime: (runtime: OnDeviceAIRuntime) => Promise<void>;
  prepareRuntime: () => Promise<void>;
  generate: (
    messages: ModelMessage[],
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
  const [generationOptions, setGenerationOptions] =
    useState<OnDeviceAIGenerationOptions>({
      maxOutputTokens: 256,
      temperature: 0.7,
    });
  const operationInFlight = useRef(false);

  useEffect(() => {
    let active = true;

    getOnDeviceAIStatus(defaultRuntime).then((nextStatus) => {
      if (active) {
        setStatus((current) =>
          current === checkingStatus ? nextStatus : current,
        );
      }
    });

    return () => {
      active = false;
    };
  }, []);

  async function selectRuntime(nextRuntime: OnDeviceAIRuntime) {
    if (nextRuntime === runtime || operationInFlight.current) {
      return;
    }
    operationInFlight.current = true;

    const nextRuntimeLabel =
      onDeviceAIRuntimes.find((option) => option.id === nextRuntime)?.label ??
      "local model";

    setStatus({
      ready: false,
      canPrepare: false,
      label: `Checking ${nextRuntimeLabel}…`,
      description: "Checking runtime availability and local model files.",
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

      setStatus(await getOnDeviceAIStatus(nextRuntime));
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The selected runtime could not be checked.",
      );
      setStatus(await getOnDeviceAIStatus(nextRuntime));
    } finally {
      operationInFlight.current = false;
      setProgress(null);
      setIsPreparing(false);
    }
  }

  async function prepareRuntime() {
    if (!status.canPrepare || operationInFlight.current) {
      return;
    }
    operationInFlight.current = true;

    setError("");
    setProgress(null);
    setIsPreparing(true);

    try {
      const nextStatus = await prepareOnDeviceAIRuntime(runtime, setProgress);
      setStatus(nextStatus);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The local model could not be prepared.",
      );
      setStatus(await getOnDeviceAIStatus(runtime));
    } finally {
      operationInFlight.current = false;
      setProgress(null);
      setIsPreparing(false);
    }
  }

  async function generate(
    messages: ModelMessage[],
    onDelta?: (text: string) => void,
  ) {
    if (!status.ready || operationInFlight.current) {
      throw new Error("The local model is not ready to send a message.");
    }

    operationInFlight.current = true;
    setIsGenerating(true);

    try {
      return await generateOnDeviceText(
        runtime,
        messages,
        generationOptions,
        onDelta,
      );
    } finally {
      operationInFlight.current = false;
      setIsGenerating(false);
    }
  }

  return (
    <OnDeviceAISettingsContext
      value={{
        runtime,
        generationOptions,
        setGenerationOptions,
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
