import { useRef, useEffect, useMemo } from "react";
import * as ColorMath from "./colormath.js";
const WIDTH = 500;
const SIZE = 25;

const sp = ColorMath.getSharedParameters()

function ColorWheel(props) {
  const { j } = props;
  const canvasRef = useRef(null);

  const points = useMemo(() => {
    console.time("points")
    const pointArray = [...Array(SIZE)].map((x, row) =>
      [...Array(SIZE)].map((y, col) => {
        const offset = (SIZE - 1) / 2;
        const [r, theta] = ColorMath.cartToPolar(
          ((col - offset) * 100) / offset,
          -((row - offset) * 100) / offset
        );

        const hue = theta;
        const chroma = r;

        const xyz = ColorMath.JChToXYZ([j, chroma, hue], sp);
        const rgb = ColorMath.xyzToRGB(xyz);
        return rgb;
      })
    );
    console.timeEnd("points")
    return pointArray
  }, [j])

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    console.time("draw")
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < WIDTH; y++) {
        const i = (x * (SIZE - 1)) / WIDTH;
        const j = (y * (SIZE - 1)) / WIDTH;
        const iMin = Math.floor(i);
        const iMax = Math.ceil(i);
        const jMin = Math.floor(j);
        const jMax = Math.ceil(j);
        const rgb00 = points[iMin][jMin];
        const rgb01 = points[iMin][jMax];
        const rgb10 = points[iMax][jMin];
        const rgb11 = points[iMax][jMax];

        const ip = i - iMin;
        const jp = j - jMin;

        const r =
          rgb00[0] * (1 - ip) * (1 - jp) +
          rgb01[0] * (1 - ip) * jp +
          rgb10[0] * ip * (1 - jp) +
          rgb11[0] * ip * jp;

        const g =
          rgb00[1] * (1 - ip) * (1 - jp) +
          rgb01[1] * (1 - ip) * jp +
          rgb10[1] * ip * (1 - jp) +
          rgb11[1] * ip * jp;

        const b =
          rgb00[2] * (1 - ip) * (1 - jp) +
          rgb01[2] * (1 - ip) * jp +
          rgb10[2] * ip * (1 - jp) +
          rgb11[2] * ip * jp;

        context.fillStyle = `rgb(${r * 2.55}, ${g * 2.55}, ${b * 2.55})`;
        context.fillRect(x, y, 1, 1);
      }
    }
    console.timeEnd("draw")
  }, [points]);

  return <canvas ref={canvasRef} width={WIDTH} height={WIDTH} />;
}

export default ColorWheel;
