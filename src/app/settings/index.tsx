import { onDeviceAIRuntimes, type OnDeviceAIRuntime } from "@/lib/on-device-ai";
import { useOnDeviceAISettings } from "@/lib/on-device-ai-settings";
import {
  Button,
  Column,
  FieldGroup,
  Host,
  Picker,
  Row,
  Spacer,
  Text,
} from "@expo/ui";

export default function SettingsScreen() {
  const {
    error,
    isGenerating,
    isPreparing,
    prepareRuntime,
    progress,
    runtime,
    selectRuntime,
    status,
  } = useOnDeviceAISettings();
  const selectedRuntime = onDeviceAIRuntimes.find(
    (option) => option.id === runtime,
  );
  const progressText = progress
    ? `${progress.label}${
        typeof progress.percentage === "number"
          ? ` ${Math.round(progress.percentage)}%`
          : ""
      }`
    : "";

  function handleRuntimeChange(nextRuntime: string | number) {
    void selectRuntime(String(nextRuntime) as OnDeviceAIRuntime);
  }

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section title="AI framework">
          <Row alignment="center" spacing={12}>
            <Text textStyle={{ fontSize: 17 }}>Framework</Text>
            <Spacer flexible />
            <Picker
              enabled={!isGenerating && !isPreparing}
              onValueChange={handleRuntimeChange}
              selectedValue={runtime}
              testID="runtime-picker"
            >
              {onDeviceAIRuntimes.map((option) => (
                <Picker.Item
                  key={option.id}
                  label={option.label}
                  value={option.id}
                />
              ))}
            </Picker>
          </Row>

          <Row alignment="center" spacing={12}>
            <Column spacing={3}>
              <Text textStyle={{ fontSize: 17, fontWeight: "600" }}>
                {status.label}
              </Text>
              <Text
                textStyle={{
                  color: "#8E8E93",
                  fontSize: 14,
                  lineHeight: 19,
                }}
              >
                {status.description}
              </Text>
            </Column>
            <Spacer flexible />
            <Text
              textStyle={{
                color: status.ready ? "#30D158" : "#FF9F0A",
                fontSize: 18,
              }}
            >
              ●
            </Text>
          </Row>

          {status.actionLabel ? (
            <Button
              disabled={!status.canPrepare || isPreparing || isGenerating}
              label={
                isPreparing ? "Preparing local model…" : status.actionLabel
              }
              onPress={() => void prepareRuntime()}
              style={{ height: 48 }}
              testID="prepare-model-button"
              variant="filled"
            />
          ) : null}

          {progress ? (
            <Text
              textStyle={{
                color: "#8E8E93",
                fontSize: 14,
                lineHeight: 19,
              }}
            >
              {progressText}
            </Text>
          ) : null}

          {error ? (
            <Text
              textStyle={{
                color: "#FF453A",
                fontSize: 15,
                lineHeight: 21,
              }}
            >
              {error}
            </Text>
          ) : null}

          <FieldGroup.SectionFooter>
            <Text
              textStyle={{
                color: "#8E8E93",
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              {`${selectedRuntime?.detail ?? "Local runtime"}. Downloadable runtimes are downloaded and loaded automatically when selected.`}
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title="About">
          <Column spacing={4}>
            <Text textStyle={{ fontSize: 16, fontWeight: "600" }}>
              React Native AI
            </Text>
            <Text
              textStyle={{
                color: "#8E8E93",
                fontSize: 14,
                lineHeight: 19,
              }}
            >
              Apple · llama.cpp · MLC Engine · AI SDK v6 streaming
            </Text>
          </Column>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
