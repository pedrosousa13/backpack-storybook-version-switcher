import { addons, types } from "@storybook/manager-api";
import { ADDON_ID, TOOL_ID } from "./constants";
import { BackpackVersions } from "./BackpackVersions";

/**
 * Note: if you want to use JSX in this file, rename it to `manager.tsx`
 * and update the entry prop in tsup.config.ts to use "src/manager.tsx",
 */

// Register the addon
addons.register('backpack-versions', () => {
  // Register the tool
  addons.add('backpack-versions/tool', {
    type: types.TOOL,
    title: 'backpack-versions',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: BackpackVersions,
  });
});
