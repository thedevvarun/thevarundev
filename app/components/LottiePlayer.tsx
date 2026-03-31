import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LottiePlayerProps {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  speed?: number;
}

export default function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  className = "",
  speed = 1,
}: LottiePlayerProps) {
  return (
    <div className={`relative ${className}`}>
      <DotLottieReact
        src={src}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
