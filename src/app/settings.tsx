import { onDeviceAIRuntimes, type OnDeviceAIRuntime } from "@/lib/on-device-ai";
import { useOnDeviceAISettings } from "@/lib/on-device-ai-settings";
import {
  Button,
  Column,
  FieldGroup,
  Host,
  Picker,
  Row,
  Slider,
  Spacer,
  Text,
} from "@expo/ui";
import { scrollEdgeEffectStyle } from "@expo/ui/swift-ui/modifiers";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";

const outputTokenOptions = [128, 256, 512];

export default function SettingsScreen() {
  const router = useRouter();
  const {
    error,
    generationOptions,
    isGenerating,
    isPreparing,
    prepareRuntime,
    progress,
    runtime,
    selectRuntime,
    setGenerationOptions,
    status,
  } = useOnDeviceAISettings();
  const busy = isGenerating || isPreparing;
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
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          accessibilityLabel="Done"
          onPress={() => router.dismissTo("/")}
        >
          Done
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={
            Platform.OS === "ios"
              ? "link"
              : require("../../assets/images/toolbar-link.png")
          }
          accessibilityLabel="GitHub Repository"
          onPress={() =>
            Linking.openURL("https://github.com/qiyangdev/minimal-expo-starter")
          }
        />
      </Stack.Toolbar>
      <Host style={{ flex: 1 }}>
        <FieldGroup modifiers={[scrollEdgeEffectStyle("soft")]}>
          <FieldGroup.Section title="AI framework">
            <Row alignment="center" spacing={12}>
              <Text textStyle={{ fontSize: 17 }}>Framework</Text>
              <Spacer flexible />
              <Picker
                enabled={!busy}
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
                disabled={!status.canPrepare || busy}
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
                {`${selectedRuntime?.detail ?? "Local runtime"}. Use the model button to download or load when needed.`}
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section title="Generation settings">
            <Row alignment="center" spacing={12}>
              <Text textStyle={{ fontSize: 17 }}>Max output</Text>
              <Spacer flexible />
              <Picker
                enabled={!busy}
                onValueChange={(value) =>
                  setGenerationOptions((options) => ({
                    ...options,
                    maxOutputTokens: Number(value),
                  }))
                }
                selectedValue={generationOptions.maxOutputTokens}
                testID="max-output-tokens-picker"
              >
                {outputTokenOptions.map((value) => (
                  <Picker.Item key={value} label={`${value} tokens`} value={value} />
                ))}
              </Picker>
            </Row>

            <Column spacing={8}>
              <Row alignment="center">
                <Text textStyle={{ fontSize: 17 }}>Temperature</Text>
                <Spacer flexible />
                <Text textStyle={{ color: "#8E8E93", fontSize: 16 }}>
                  {generationOptions.temperature.toFixed(1)}
                </Text>
              </Row>
              <Slider
                disabled={busy}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(temperature) =>
                  setGenerationOptions((options) => ({ ...options, temperature }))
                }
                testID="temperature-slider"
                value={generationOptions.temperature}
              />
            </Column>

            <FieldGroup.SectionFooter>
              <Text textStyle={{ color: "#8E8E93", fontSize: 13, lineHeight: 18 }}>
                Lower temperatures are more predictable; higher values produce
                more varied responses.
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
    </>
  );
}
