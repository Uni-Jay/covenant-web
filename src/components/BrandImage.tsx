import { useState } from 'react';

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  label?: string;
};

/**
 * Shows a picture, or a branded church panel when there is no picture or it fails to load
 * (old uploads from before the move to Cloudinary no longer exist).
 */
const BrandImage = ({ src, alt, className = '', label }: Props) => {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`${className} relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-accent-700 text-white`}
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_55%)]" />
      <img src="/image/New_Logo.png" alt="" className="relative w-1/4 max-w-[96px] min-w-[48px] drop-shadow-lg" />
      {label && <p className="relative px-4 text-center text-sm font-semibold tracking-wide text-white/90">{label}</p>}
    </div>
  );
};

export default BrandImage;
