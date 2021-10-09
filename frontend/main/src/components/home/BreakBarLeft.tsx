export default function BreakBarLeft({
  children,
}: {
  children: any;
}): JSX.Element {
  return (
    <section className="relative flex items-center justify-between w-full gap-4 p-4 -mt-1 overflow-x-auto overflow-y-hidden vertical-clip">
      {children}
      <style jsx>{`
        section:after {
          content: '';
          position: absolute;
          width: 1.5rem;
          bottom: 0;
          left: 4%;
          border: 1.5rem solid transparent;
          border-top-color: #4b0a75;
          border-bottom: 0;
          border-right: -1.5rem;
          margin-bottom: -1.5rem;
        }
      `}</style>
    </section>
  );
}
