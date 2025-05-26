import { isDev } from "@/lib/env";
import { cn } from "@/lib/utils";
import { draftMode } from "next/headers";
import { DisableDraftMode, LaunchAdminButton } from "./sanity";

export const ToolbarActions = async () => {
  const { isEnabled: draftModeEnabled } = await draftMode();

  if (isDev) {
    return (
      <div className="fixed flex flex-row top-4 right-4">
        <LaunchAdminButton
          className={cn(!draftModeEnabled && "rounded-r-full")}
        />

        {draftModeEnabled && (
          <DisableDraftMode className={cn(!isDev && "rounded-l-full")} />
        )}
      </div>
    );
  }
};
