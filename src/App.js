import "./App.css";
import * as ColorMath from "./colormath.js";
import ColorWheel from "./ColorWheel.js";

const SIZE = 11;

const sp = ColorMath.getSharedParameters();
function App() {
  const points = [...Array(SIZE)].map((x, row) =>
    [...Array(SIZE)].map((y, col) => {
      const offset = (SIZE - 1) / 2;
      const [r, theta] = ColorMath.cartToPolar(
        ((col - offset) * 100) / offset,
        -((row - offset) * 100) / offset
      );

      const hue = theta;
      const chroma = r;
      const J = 70;

      const xyz = ColorMath.JChToXYZ([J, chroma, hue], sp);
      const rgb = ColorMath.xyzToRGB(xyz);
      return rgb;
    })
  );

  return (
    <div className="App">
      <ColorWheel points={points} size={SIZE} />
    </div>
  );
}

export default App;
