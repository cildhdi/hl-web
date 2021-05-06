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
  return (
    await fetch(
      useServerless.data?.[0] ? '/api/reco' : 'http://127.0.0.1:5000/reco',
      {
        method: 'post',
        body: JSON.stringify(param),
        mode: 'cors',
      }
    )
  ).json();
}
