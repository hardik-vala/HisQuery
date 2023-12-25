import React from "react";
import { createContext, PropsWithChildren } from "react";
import { useCurrentUserContext, User } from "../currentUser/currentUser";
import posthog from "posthog-js";
import { trackOpen } from "../../lib/analytics/track";

let initialized = false;
let openTracked = false;

const AnalyticsContext = createContext<null>(null);

function initialize(currentUser: User) {
  if (initialized) {
    return;
  }
  if (!process.env.POSTHOG_KEY) {
    console.error("Failed to initialize analytics: missing key");
    return;
  }
  posthog.init(process.env.POSTHOG_KEY, {
    autocapture: false,
    api_host: "https://app.posthog.com",
    capture_pageview: false,
    disable_session_recording: process.env.NODE_ENV !== "production",
    enable_recording_console_log: true,
    loaded: (ph) => ph.identify(currentUser.id),
  });
  initialized = true;
}

export const AnalyticsContextProvider = (props: PropsWithChildren<{}>) => {
  const { user } = useCurrentUserContext();
  if (user) {
    if (initialized) {
      if (!openTracked) {
        trackOpen();
      }
    } else {
      initialize(user);
    }
  }

  return (
    <AnalyticsContext.Provider value={null}>
      {props.children}
    </AnalyticsContext.Provider>
  );
};
