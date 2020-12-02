import AJLogo from '../icons/AJLogo';
import AJLogoLeft from '../icons/AJLogoLeft';
import SloganNunito from './SloganNunito';
import TitleNunito from './TitleNunito';

export default function TitleSloganLogo({
  titleClassName = 'block w-64 h-12',
  titleFill = 'white',
  sloganClassName = 'block w-64 h-12',
  sloganFill = 'white',
  ajClassName = 'block w-16 h-16',
  ajFaceStandard = true,
}) {
  return (
    <div className="flex content-center">
      {!ajFaceStandard ? (
        <div className="flex flex-col justify-center pb-8">
          <AJLogoLeft className={ajClassName} />
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col">
        <div className="flex">
          <TitleNunito className={titleClassName} fill={titleFill} />
        </div>
        <div>
          <SloganNunito className={sloganClassName} fill={sloganFill} />
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
