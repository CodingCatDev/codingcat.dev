const CodeWiggle = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <div className="bg-yellow-50">{children}</div>;
};
export default CodeWiggle;
