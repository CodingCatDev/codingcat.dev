const WordHighlight = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return (
    <span className="p-1 rounded cursor-pointer text-basics-900 dark:text-basics-900 bg-yellow-50 hover:text-5xl hover:bg-secondary-300 dark:bg-yellow-50">
      {children}
    </span>
  );
};
export default WordHighlight;
