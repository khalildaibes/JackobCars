"use client";
import React from "react";
import { Range, getTrackBackground } from "react-range";
import { IRenderThumbParams, IRenderTrackParams } from "react-range/lib/types";
import {Text} from "../Text";

const MIN = 5000;
const MAX = 500000;

type SeekBarProps = {
  min?: number;
  max?: number;
  inputValue?: number[];
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  thumbChildren?: React.ReactNode;
  trackColors: string[];
  trackBackground?: {};
};
const SeekBar = ({
  min = MIN,
  max = MAX,
  inputValue = [],
  className = "",
  trackClassName = "",
  thumbClassName = "",
  thumbChildren = "",
  trackColors,
  trackBackground = {},
  ...otherProps
}: SeekBarProps) => {
  const [values, setValues] = React.useState(inputValue || []);

  React.useEffect(() => {
    setValues(inputValue || []);
  }, [inputValue]);

  const renderSeekBarThumb = ({ props, isDragged }: IRenderThumbParams) => {
    return (
      <div {...props} className={thumbClassName}>
        {thumbChildren}
      </div>
    );
  };

  const renderSeekBarTrack = ({ props, children }: IRenderTrackParams) => {
    return (
      <div
        className={className}
        style={{
          ...props.style,
        }}
      >
        <div
          ref={props.ref}
          className={trackClassName}
          style={{
            background: getTrackBackground({
              values: values,
              colors: trackColors,
              min,
              max,
              ...trackBackground,
            }),
            alignSelf: "center",
          }}
        >
          {children}
        </div>
      </div>
    );
  };

  return (
    <>
      <Range
        values={values}
        min={min}
        max={max}
        step={1000}
        onChange={(v) => setValues(v)}
        renderThumb={renderSeekBarThumb}
        renderTrack={renderSeekBarTrack}
        {...otherProps}
      />
      <Text>
        Selected: {values[0]} - {values[1]}
      </Text>
    </>
  );
};

export { SeekBar };
