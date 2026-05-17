import React, { useEffect, useState } from "react";

import { AppAlertModal } from "@/app/component/AppAlertModal";
import {
  registerAppAlertController,
  type AppAlertConfig,
} from "@/app/functions/appAlert";

interface Props {
  children: React.ReactNode;
}

export const AppAlertProvider = ({ children }: Props) => {
  const [alertConfig, setAlertConfig] = useState<AppAlertConfig | null>(null);

  useEffect(() => {
    registerAppAlertController((nextConfig) => {
      setAlertConfig(nextConfig);
    });

    return () => {
      registerAppAlertController(null);
    };
  }, []);

  return (
    <>
      {children}
      <AppAlertModal
        isVisible={alertConfig !== null}
        title={alertConfig?.title ?? ""}
        message={alertConfig?.message ?? ""}
        actions={alertConfig?.actions ?? []}
        onClose={() => setAlertConfig(null)}
      />
    </>
  );
};
