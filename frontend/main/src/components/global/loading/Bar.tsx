export const Bar = ({
  animationDuration,
  progress,
}: {
  animationDuration: number;
  progress: number;
}): JSX.Element => (
  <div
    className="fixed top-0 left-0 z-50 w-full h-1 bg-secondary-500"
    style={{
      marginLeft: `${(-1 + progress) * 100}%`,
      transition: `margin-left ${animationDuration}ms linear`,
    }}
  ></div>
);
