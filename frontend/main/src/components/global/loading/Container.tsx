export const Container = ({
  animationDuration,
  children,
  isFinished,
}: {
  animationDuration: number;
  children: JSX.Element;
  isFinished: boolean;
}): JSX.Element => (
  <div
    className="pointer-events-none"
    style={{
      opacity: isFinished ? 0 : 1,
      transition: `opacity ${animationDuration}ms linear`,
    }}
  >
    {children}
  </div>
);
