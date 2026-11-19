import { useOnDeviceAISettings } from "@/lib/on-device-ai-settings";
import type { ModelMessage } from "ai";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "expo-router/react-navigation";
import { SymbolView } from "expo-symbols";
import { type ComponentRef, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ChatTurn = {
  prompt: string;
  response: string;
  error?: string;
};

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, dark } = useTheme();
  const { generate, isGenerating, isPreparing, status } = useOnDeviceAISettings();
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [keyboardVisible, setKeyboardVisible] = useState(() => Keyboard.isVisible());
  const scrollView = useRef<ComponentRef<typeof ScrollView>>(null);
  const followsConversation = useRef(true);
  const sending = useRef(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const canSend =
    status.ready && !isGenerating && !isPreparing && draft.trim().length > 0;
  const subduedText = dark ? "#a1a1aa" : "#52525b";
  const composerPadding = Math.max(8, keyboardVisible ? 0 : insets.bottom);
  const userBubble = dark ? "#25476c" : "#dceafe";
  const sendColor = dark ? "#8dc1ff" : "#1764c0";
  const sendTextColor = dark ? "#12233a" : "#fff";

  function openSettings() {
    Keyboard.dismiss();
    router.navigate("/settings");
  }

  function followConversation() {
    if (followsConversation.current) {
      scrollView.current?.scrollToEnd({ animated: false });
    }
  }

  function trackScroll({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    followsConversation.current =
      contentSize.height - contentOffset.y - layoutMeasurement.height < 64;
  }

  async function sendMessage() {
    if (!canSend || sending.current) {
      return;
    }

    sending.current = true;
    const prompt = draft.trim();
    const turnIndex = turns.length;
    const messages: ModelMessage[] = [];

    for (const turn of turns) {
      if (!turn.error && turn.response) {
        messages.push(
          { role: "user", content: turn.prompt },
          { role: "assistant", content: turn.response },
        );
      }
    }
    messages.push({ role: "user", content: prompt });

    function updateTurn(update: Partial<ChatTurn>) {
      setTurns((current) =>
        current.map((turn, index) =>
          index === turnIndex ? { ...turn, ...update } : turn,
        ),
      );
    }

    followsConversation.current = true;
    setTurns((current) => [...current, { prompt, response: "" }]);
    setDraft("");

    try {
      const response = await generate(messages, (text) =>
        updateTurn({ response: text }),
      );
      if (!response.trim()) {
        throw new Error("The model returned no text. Try sending a shorter message or increasing max output in Settings.");
      }
      updateTurn({ response });
    } catch (error) {
      updateTurn({
        error: error instanceof Error ? error.message : "The model could not respond.",
      });
    } finally {
      sending.current = false;
    }
  }

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={Platform.OS === "ios" ? "slider.horizontal.3" : undefined}
          accessibilityLabel="Settings"
          onPress={openSettings}
        >
          Settings
        </Stack.Toolbar.Button>
      </Stack.Toolbar>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.screen, { backgroundColor: colors.background }]}
      >
        <ScrollView
          ref={scrollView}
          contentContainerStyle={styles.conversation}
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={followConversation}
          onLayout={followConversation}
          onScroll={trackScroll}
          scrollEventThrottle={16}
        >
          {turns.length === 0 && (
            <View style={styles.empty}>
              <Text accessibilityRole="header" style={[styles.emptyTitle, { color: colors.text }]}>
                Start a conversation
              </Text>
              <Text style={[styles.emptyDetail, { color: subduedText }]}>
                Messages stay on this device.
              </Text>
            </View>
          )}

          {turns.map((turn, index) => (
            <View key={index} style={styles.turn}>
              <View style={[styles.userBubble, { backgroundColor: userBubble }]}>
                <Text selectable style={[styles.message, { color: colors.text }]}>
                  {turn.prompt}
                </Text>
              </View>
              {!!turn.response && (
                <Text selectable style={[styles.message, styles.reply, { color: colors.text }]}>
                  {turn.response}
                </Text>
              )}
              {!!turn.error && (
                <Text accessibilityRole="alert" style={[styles.feedback, { color: colors.notification }]}>
                  {turn.error}
                </Text>
              )}
              {isGenerating && index === turns.length - 1 && !turn.response && !turn.error && (
                <Text style={[styles.feedback, { color: subduedText }]}>
                  Thinking…
                </Text>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={[styles.bottom, { borderColor: colors.border, paddingBottom: composerPadding }]}>
          {!status.ready && (
            <Pressable accessibilityRole="button" onPress={openSettings} style={styles.status}>
              <Text style={[styles.feedback, { color: subduedText }]}>
                {isPreparing ? "Preparing model…" : status.label}
              </Text>
              <Text style={[styles.feedback, { color: colors.text }]}>
                Settings
              </Text>
            </Pressable>
          )}
          <View style={[styles.composer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              accessibilityLabel="Message"
              multiline
              onChangeText={setDraft}
              placeholder="Message…"
              placeholderTextColor={subduedText}
              style={[styles.input, { color: colors.text }]}
              testID="ai-prompt"
              value={draft}
            />
            <Pressable
              accessibilityLabel="Send message"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSend }}
              disabled={!canSend}
              onPress={() => void sendMessage()}
              style={({ pressed }) => [
                styles.sendButton,
                {
                  backgroundColor: canSend ? sendColor : colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              testID="generate-button"
            >
              <SymbolView
                name={{ ios: "arrow.up", android: "arrow_upward", web: "arrow_upward" }}
                size={22}
                tintColor={canSend ? sendTextColor : subduedText}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  conversation: { flexGrow: 1, gap: 24, paddingHorizontal: 16, paddingVertical: 24 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  emptyTitle: { fontSize: 23, fontWeight: "600", textAlign: "center" },
  emptyDetail: { fontSize: 15, textAlign: "center" },
  turn: { gap: 14 },
  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  message: { fontSize: 16, lineHeight: 24 },
  reply: { paddingHorizontal: 4 },
  feedback: { fontSize: 14, lineHeight: 20 },
  bottom: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12, paddingTop: 8 },
  status: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 6, padding: 8 },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    padding: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 26,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 128,
    paddingHorizontal: 10,
    paddingVertical: 11,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: "center",
  },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
