import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

let webContainerInstance: WebContainer | null = null; // Singleton instance

export function useWebContainer() {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);

  async function init() {
    if (!webContainerInstance) {
      webContainerInstance = await WebContainer.boot();
    }
    setWebContainer(webContainerInstance);
  }

  useEffect(() => {
    init();
  }, []);

  return webContainer;
}
