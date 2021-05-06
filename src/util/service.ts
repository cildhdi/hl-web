import { useServer } from '../hooks/use-server';
import { useServerless } from '../hooks/use-serverless';
import { framesToShapeTrack } from './frame';

export interface TestItem {
  shape: number[][];
  track: number[][];
  label: string;
}

export async function fetchTestCases(): Promise<TestItem[]> {
  return (await fetch('/test-cases.json')).json();
}

export async function reco(
  param: ReturnType<typeof framesToShapeTrack>
): Promise<{
  code: number;
  data: string;
}> {
  const addr = useServerless.data?.[0]
    ? '/api/reco'
    : `${useServer.data?.[0] ?? 'http://127.0.0.1:5000'}/reco`;
  const http = addr.startsWith('http:');

  return (
    await fetch(http ? '/api/proxy' : addr, {
      method: 'post',
      body: JSON.stringify(Object.assign({}, param, http ? { addr } : {})),
      mode: 'cors',
    })
  ).json();
}
