import AJLogo from '@/components/global/icons/AJPrimary';
import AJLogoLeft from '@/components/global/icons/AJAlt';
import TitleNunito from './TitleNunito';

export default function TitleSloganLogo({
  titleClassName = 'block w-48 h-12',
  titleFill = 'white',
  ajClassName = 'block w-12 h-12',
  ajFaceStandard = true,
}: {
  titleClassName?: string;
  titleFill?: string;
  ajClassName?: string;
  ajFaceStandard?: boolean;
}): JSX.Element {
  return (
    <div className="flex content-center">
      {!ajFaceStandard ? (
        <div className="flex flex-col justify-center">
          <AJLogoLeft className={ajClassName} />
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col">
        <div className="flex">
          <TitleNunito className={titleClassName} fill={titleFill} />
        </div>
      </div>
      {ajFaceStandard ? (
        <div className="flex flex-col justify-center pb-8">
          <AJLogo className={ajClassName} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
