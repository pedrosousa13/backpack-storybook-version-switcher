import React, { memo, useCallback, useEffect, useState } from "react";
import { useGlobals, useStorybookApi } from "@storybook/manager-api";
import { Form } from "@storybook/components";
import axios from "axios";

export const BackpackVersions = memo(function MyAddonSelector() {
  const [globals, updateGlobals] = useGlobals();
  const [href, setHref] = useState<URL | undefined>();
  const [data, setData] = useState<any>(null);
  const api = useStorybookApi();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setHref(new URL(window.location.href));
  }, []);

  useEffect(() => {
    (async () => {
      setData(await axios.get('/api/getAllVersions/').then((res) => res.data))
    })()
  }, []);

  const isActive =
    [true, 'true'].includes(globals['backpackVersions']) ||
    process.env.NODE_ENV === 'production';

  const toggleMyTool = useCallback(() => {
    updateGlobals({
      ['backpackVersions']: !isActive,
    });
  }, [isActive]);

  useEffect(() => {
    api.setAddonShortcut('backpack-versions', {
      label: 'Backpack version switcher',
      defaultShortcut: ['O'],
      actionName: 'version-switch',
      showInMenu: false,
      action: toggleMyTool,
    });
  }, [toggleMyTool, api]);

  return isActive && data?.versions ? (
    <Form.Select
      align={'center'}
      size={'flex'}
      id='storybook-version-switcher'
      onChange={(event) => {
        window.location.href = `/${event.target.value}/`;
      }}
      defaultValue={href?.pathname.replace(/^\//, '')}
      style={{
        padding: '5px 0 5px 5px',
        marginTop: '3px',
        marginLeft: '5px',
      }}
    >
      <option disabled>Backpack switcher</option>
      {data?.versions?.map(
        ({ version, folderName }: { folderName: string; version: string }) => {
          const isLatest = folderName === 'latest/';
          const versionToSemver = version.replace(/-(?=\d)/g, '.');

          return (
            <option key={versionToSemver} value={folderName}>
              {isLatest ? `${versionToSemver} - latest` : versionToSemver}
            </option>
          );
        }
      )}
    </Form.Select>
  ) : null;
});
