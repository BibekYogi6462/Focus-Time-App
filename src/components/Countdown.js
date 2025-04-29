import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';
import { fontSizes, spacing } from '../utils/size';
import { colors } from '../utils/colors';

const minutesToMillis = (min) => min * 1000 * 60;
const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({ minutes = 1, isPaused, onProgress, onEnd }) => {
  const interval = useRef(null);
  const [millis, setMillis] = useState(minutesToMillis(minutes));

  const countDown = useCallback(() => {
    const reset = () => setMillis(minutesToMillis(minutes));

    setMillis((time) => {
      if (time === 0) {
        clearInterval(interval.current);
        onEnd(reset);
        return time;
      }
      return time - 1000;
    });
  }, [minutes, onEnd]);

  useEffect(() => {
    setMillis(minutesToMillis(minutes));
  }, [minutes]);

  useEffect(() => {
    const progressValue = Math.max(0, Math.min(1, Number((millis / minutesToMillis(minutes)).toFixed(2))));
    onProgress(progressValue);
  }, [millis, minutes, onProgress]);

  useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    }

    interval.current = setInterval(countDown, 1000);

    return () => clearInterval(interval.current);
  }, [isPaused, countDown]);

  const minute = Math.floor(millis / 1000 / 60) % 60;
  const seconds = Math.floor(millis / 1000) % 60;

  return (
    <Text style={styles.text}>
      {formatTime(minute)}:{formatTime(seconds)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    padding: spacing.lg,
    backgroundColor: 'rgba(94, 132, 226, 0.3)',
  },
});
