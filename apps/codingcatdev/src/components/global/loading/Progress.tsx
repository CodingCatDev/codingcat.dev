import { useNProgress } from '@tanem/react-nprogress';

import { Bar } from '@/components/global/loading/Bar';
import { Container } from '@/components/global/loading/Container';

export const Progress = ({
  isAnimating,
}: {
  isAnimating: boolean;
}): JSX.Element => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </Container>
  );
};
