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
  TextInput,
} from "@expo/ui";
import { useState } from "react";

const defaultPrompt = "Explain on-device AI in three short sentences.";
const outputTokenOptions = [128, 256, 512];

export default function HomeScreen() {
  const {
    generate,
    isGenerating,
    isPreparing,
    runtimeLabel,
    status,
  } = useOnDeviceAISettings();
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [maxOutputTokens, setMaxOutputTokens] = useState(256);
  const [temperature, setTemperature] = useState(0.7);

  async function handleGenerate() {
    const nextPrompt = prompt.trim();

    if (!nextPrompt || isGenerating || isPreparing) {
      return;
    }

    setError("");
    setResponse("");

    try {
      const text = await generate(
        nextPrompt,
        { maxOutputTokens, temperature },
        setResponse,
      );
      setResponse(text);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The on-device model could not generate a response.",
      );
    }
  }

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section title="Generation settings">
          <Row alignment="center" spacing={12}>
            <Text textStyle={{ fontSize: 17 }}>Max output</Text>
            <Spacer flexible />
            <Picker
              enabled={!isGenerating && !isPreparing}
              onValueChange={(value) => setMaxOutputTokens(Number(value))}
              selectedValue={maxOutputTokens}
              testID="max-output-tokens-picker"
            >
              {outputTokenOptions.map((value) => (
                <Picker.Item
                  key={value}
                  label={`${value} tokens`}
                  value={value}
                />
              ))}
            </Picker>
          </Row>

          <Column spacing={8}>
            <Row alignment="center">
              <Text textStyle={{ fontSize: 17 }}>Temperature</Text>
              <Spacer flexible />
              <Text
                textStyle={{
                  color: "#8E8E93",
                  fontSize: 16,
                }}
              >
                {temperature.toFixed(1)}
              </Text>
            </Row>
            <Slider
              disabled={isGenerating || isPreparing}
              max={1}
              min={0}
              onValueChange={setTemperature}
              step={0.1}
              testID="temperature-slider"
              value={temperature}
            />
          </Column>

          <FieldGroup.SectionFooter>
            <Text
              textStyle={{
                color: "#8E8E93",
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              Lower temperatures are more predictable; higher values produce
              more varied responses.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title="Prompt">
          <TextInput
            defaultValue={defaultPrompt}
            editable={!isGenerating && !isPreparing}
            multiline
            numberOfLines={5}
            onChangeText={setPrompt}
            placeholder="Ask the on-device model…"
            returnKeyType="default"
            testID="ai-prompt"
            textStyle={{ fontSize: 17, lineHeight: 24 }}
          />
          <Button
            disabled={
              !status.ready ||
              !prompt.trim() ||
              isGenerating ||
              isPreparing
            }
            label={isGenerating ? "Generating…" : "Generate privately"}
            onPress={handleGenerate}
            style={{ height: 48 }}
            testID="generate-button"
            variant="filled"
          />
          <FieldGroup.SectionFooter>
            <Text
              textStyle={{
                color: "#8E8E93",
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              {`Uses ${runtimeLabel}, configured in Settings. Your prompt stays on this device.`}
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        {(response || isGenerating) && (
          <FieldGroup.Section title="Response">
            <Text textStyle={{ fontSize: 17, lineHeight: 25 }}>
              {response || "Thinking…"}
            </Text>
          </FieldGroup.Section>
        )}

        {error ? (
          <FieldGroup.Section title="Generation failed">
            <Text
              textStyle={{
                color: "#FF453A",
                fontSize: 15,
                lineHeight: 21,
              }}
            >
              {error}
            </Text>
          </FieldGroup.Section>
        ) : null}

      </FieldGroup>
    </Host>
  );
}
