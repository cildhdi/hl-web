import { ROOM_SERVER, SERVER } from '../config';
import { framesToList, framesToShapeTrack } from './frame';

export interface TestItem {
  shape: number[][];
  track: number[][];
  label: string;
}

export async function fetchTestCases(): Promise<TestItem[]> {
  return (await fetch('/test-cases.json')).json();
}

export async function recold(
  param: ReturnType<typeof framesToShapeTrack>
): Promise<{
  code: number;
  data: string;
}> {
  const addr = `${ROOM_SERVER}/recold`;

  return (
    await fetch(addr, {
      method: 'post',
      body: JSON.stringify(param),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    })
  ).json();
}

export async function reco(param: ReturnType<typeof framesToList>): Promise<{
  code: number;
  data: string;
}> {
  const addr = `${SERVER}/reco`;
  return (
    await fetch(addr, {
      method: 'post',
      body: JSON.stringify(param),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    })
  ).json();
}
