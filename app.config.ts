import type { ConfigContext, ExpoConfig } from "expo/config";

import { expo } from "./app.json";

export default ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();

  return {
    ...config,
    name: config.name ?? expo.name,
    slug: config.slug ?? expo.slug,
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: { apiKey: googleMapsApiKey },
      },
    },
    extra: {
      ...config.extra,
      googleMapsConfigured: Boolean(googleMapsApiKey),
    },
  };
};
