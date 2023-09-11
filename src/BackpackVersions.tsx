import React, { useEffect, useState } from "react";
import axios from "axios";

const BackpackVersions = () => {
  const [href, setHref] = useState<URL | undefined>();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setHref(new URL(window.location.href));
  }, []);

  useEffect(() => {
    (async () => {
      setData(await axios.get('/api/getAllVersions/').then((res) => res.data))
    })()
  }, []);
  console.log({data})
  return data?.versions ? (
    <select
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
    </select>
  ) : null;
};

export default BackpackVersions;