import { ArrangementView, Host, Text, VStack } from "@expo/ui/swift-ui";
import {
  arrangementViewStyle,
  background,
  frame,
} from "@expo/ui/swift-ui/modifiers";
import { Platform } from "react-native";

const fill = frame({ maxWidth: Infinity, maxHeight: Infinity });

export default function ArrangementViewDemo() {
  if (Number.parseFloat(String(Platform.Version)) < 27.1) {
    return (
      <Host style={{ flex: 1 }}>
        <VStack modifiers={[fill]}>
          <Text>ArrangementView requires iOS 27.1 or later.</Text>
        </VStack>
      </Host>
    );
  }

  return (
    <Host style={{ flex: 1 }}>
      <ArrangementView modifiers={[arrangementViewStyle("split"), fill]}>
        <ArrangementView.Primary>
          <VStack modifiers={[fill, background("#DCEBFF")]}>
            <Text>Primary</Text>
          </VStack>
        </ArrangementView.Primary>
        <ArrangementView.Secondary>
          <VStack modifiers={[fill, background("#FFE8D6")]}>
            <Text>Secondary</Text>
          </VStack>
        </ArrangementView.Secondary>
      </ArrangementView>
    </Host>
  );
}
