import type { PlasmoCSConfig } from "plasmo";

import { storage } from "@/storages";
import { getGitlabEmail, type GitlabFrequentProjectMeta } from "@/utils/gitlab";

export const config: PlasmoCSConfig = {
  matches: ["https://gitlab.gz.cvte.cn/*"],
  run_at: "document_end"
};

const getFrequentProjects = (localStorageKey: string): Array<GitlabFrequentProjectMeta> => {
  try {
    const stringifyData = window.localStorage.getItem(localStorageKey);
    const projects = JSON.parse(stringifyData);
    if (!Array.isArray(projects)) {
      throw new Error(`${localStorageKey}'data is not an array`);
    }
    return projects;
  } catch (error) {
    console.error("getFrequentProjects error :>> ", error);
    return [];
  }
};

const main: VoidFunction = async () => {
  const enabled = await storage.get("enabled");
  if (!enabled) return;

  // ==============start: 初始化 gitlabUsername ==============
  const initialUsername = await storage.get("gitlabUserName");
  if (!initialUsername) {
    const gitlabEmail = await getGitlabEmail();
    const result = gitlabEmail.split("@")[0];
    await storage.set("gitlabUserName", result);
  }
  // ==============end: 初始化 gitlabUsername ==============
  const gitlabUsername = await storage.get("gitlabUserName");
  const projects = getFrequentProjects(`${gitlabUsername}/frequent-projects`);
  console.log("projects :>> ", projects);
};

// main();
