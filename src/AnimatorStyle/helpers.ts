import { getTinyColor, mapObject } from '@huds0n/utilities';

import { Color, RGBA } from './types';

export function getStartNumber(
  oldStart: number,
  oldEnd: number,
  progress: number,
) {
  return (oldEnd - oldStart) * progress + oldStart;
}

export function getStartString(
  oldStart: string,
  oldEnd: string,
  progress: number,
  suffix: string,
) {
  const oldStartNumber = toNumber(oldStart, suffix);
  const oldEndNumber = toNumber(oldEnd, suffix);

  return (
    getStartNumber(oldStartNumber, oldEndNumber, progress).toString() + suffix
  );
}

function toNumber(string: string, suffix: string) {
  const l = suffix.length;

  return Number(string.slice(0, -l));
}

const TRANSPARENT_RGBA = { r: 0, g: 0, b: 0, a: 0 };
export const TRANSPARENT_STRING = 'rgba(0,0,0,0)';

function toRGBA(color: Color): RGBA {
  return getTinyColor(color || undefined)?.toRgb() || TRANSPARENT_RGBA;
}

function rgbaToString({ r, g, b, a }: RGBA) {
  return `rgba(${r},${g},${b},${a})`;
}

export function colorToRGBAString(color: Color) {
  return rgbaToString(toRGBA(color));
}

export function getStartColor(
  oldStart: string,
  oldEnd: string,
  progress: number,
  newColor: Color,
) {
  const oldStartRGBA = toRGBA(oldStart);
  const oldEndRGBA = toRGBA(oldEnd);

  let newStart = mapObject<RGBA, number, number>(oldStartRGBA, (prop, key) => {
    // @ts-ignore
    return (oldEndRGBA[key] - oldStartRGBA[key]) * progress + oldStartRGBA[key];
  });

  if (newStart.a === 0) {
    newStart = { ...toRGBA(newColor), a: 0 };
  }

  return rgbaToString(newStart);
}
