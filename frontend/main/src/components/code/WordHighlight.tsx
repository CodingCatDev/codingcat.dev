const WordHighlight = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return (
    <p className="p-1 transition duration-500 ease-in-out transform rounded cursor-pointer text-basics-900 dark:text-basics-900 bg-yellow-50 hover:scale-150 hover dark:bg-yellow-50">
      {children}
    </p>
  );
};
export default WordHighlight;
