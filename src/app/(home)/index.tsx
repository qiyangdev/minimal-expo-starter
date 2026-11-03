import Constants from "expo-constants";
import { AppleMaps, GoogleMaps, useLocationPermissions } from "expo-maps";
import { useTheme } from "expo-router";
import { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

const cameraPosition = {
  coordinates: { latitude: 31.2304, longitude: 121.4737 },
  zoom: 12,
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const [permission, requestPermission] = useLocationPermissions();
  const mapAvailable =
    (Platform.OS === "ios" && Number.parseInt(Platform.Version, 10) >= 17) ||
    (Platform.OS === "android" &&
      Boolean(Constants.expoConfig?.extra?.googleMapsConfigured));

  useEffect(() => {
    if (mapAvailable && permission?.status === "undetermined") {
      void requestPermission().catch((error: unknown) => {
        console.warn("Unable to request map location permission", error);
      });
    }
  }, [mapAvailable, permission?.status, requestPermission]);

  let message = "Maps are only available on Android and iOS.";

  if (Platform.OS === "ios") {
    if (Number.parseInt(Platform.Version, 10) >= 17) {
      return (
        <AppleMaps.View
          style={styles.map}
          cameraPosition={cameraPosition}
          properties={{ isMyLocationEnabled: permission?.granted === true }}
          uiSettings={{
            compassEnabled: true,
            myLocationButtonEnabled: true,
            scaleBarEnabled: true,
            togglePitchEnabled: true,
          }}
        />
      );
    }
    message = "Maps require iOS 17 or later.";
  } else if (Platform.OS === "android") {
    if (Constants.expoConfig?.extra?.googleMapsConfigured) {
      return (
        <GoogleMaps.View
          style={styles.map}
          cameraPosition={cameraPosition}
          properties={{
            isMyLocationEnabled: permission?.granted === true,
            isIndoorEnabled: true,
            isBuildingEnabled: true,
          }}
          uiSettings={{
            compassEnabled: true,
            indoorLevelPickerEnabled: true,
            mapToolbarEnabled: true,
            myLocationButtonEnabled: true,
            zoomControlsEnabled: true,
            rotationGesturesEnabled: true,
            scrollGesturesEnabled: true,
            scrollGesturesEnabledDuringRotateOrZoom: true,
            tiltGesturesEnabled: true,
            zoomGesturesEnabled: true,
          }}
        />
      );
    }
    message = "Map unavailable.";
  }

  return (
    <View style={styles.placeholder}>
      <Text style={{ color: colors.text }}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
