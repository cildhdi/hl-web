import { createModel } from 'hox';
import Leap from 'leapjs';
import { pull } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToggle } from 'react-use';

import { Frame } from '../util/frame';

type FrameCallback = (frame: Frame) => void;

const createLeapController = () => new Leap.Controller();

export const useLeapController = createModel(() => {
  const [leapController, setLeapController] = useState(createLeapController);

  const resetLeapController = useCallback(() => {
    const nextLeapController = createLeapController();
    setLeapController(nextLeapController);
    toggleServiceConnected(false);
    toggleDeviceStreaming(false);
    return nextLeapController;
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  const [serviceConnected, toggleServiceConnected] = useToggle(false);
  const [deviceStreaming, toggleDeviceStreaming] = useToggle(false);
  const [paused, togglePaused] = useToggle(false);

  useEffect(() => {
    const listener = () => toggleServiceConnected(true);
    leapController.on('connect', listener);
    return () => leapController.off('connect', listener);
  }, [leapController]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const listener = () => toggleServiceConnected(false);
    leapController.on('disconnect', listener);
    return () => leapController.off('disconnect', listener);
  }, [leapController]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const listener = () => toggleDeviceStreaming(true);
    leapController.on('deviceStreaming', listener);
    return () => leapController.off('deviceStreaming', listener);
  }, [leapController]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const listener = () => toggleDeviceStreaming(false);
    leapController.on('deviceStopped', listener);
    return () => leapController.off('deviceStopped', listener);
  }, [leapController]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const listener = () => togglePaused(true);
    leapController.on('blur', listener);
    return () => leapController.off('blur', listener);
  }, [leapController]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const listener = () => togglePaused(false);
    leapController.on('focus', listener);
    return () => leapController.off('focus', listener);
  }, [leapController]); //eslint-disable-line react-hooks/exhaustive-deps

  const frameCallbacks = useRef<FrameCallback[]>([]);

  useEffect(() => {
    const listener = (frame: Frame) =>
      frameCallbacks.current?.forEach((fn) => fn(frame));
    leapController.loop(listener);
    return () => {
      leapController.off(leapController.frameEventName, listener);
    };
  }, [leapController]);

  const listenFrame = useCallback((callback: FrameCallback) => {
    frameCallbacks.current.push(callback);
    return () => {
      pull(frameCallbacks.current, callback);
    };
  }, []);

  return {
    paused,
    serviceConnected,
    deviceStreaming,
    leapController,
    resetLeapController,
    listenFrame,
  };
});
