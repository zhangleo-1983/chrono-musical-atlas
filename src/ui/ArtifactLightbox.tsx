import { useEffect, useRef, useState, type RefObject } from 'react';
import type { ArtifactImage } from '../domain/types';

interface ArtifactLightboxProps {
  image: ArtifactImage;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
}

export default function ArtifactLightbox({ image, onClose, returnFocusRef }: ArtifactLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  useEffect(() => () => { returnFocusRef?.current?.focus(); }, [returnFocusRef]);

  return <div className="artifact-lightbox" role="dialog" aria-modal="true" aria-label="文物实拍" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="artifact-card">
      <div className="artifact-card-head">
        <span className="eyebrow">ARTIFACT / COMMONS</span>
        <button ref={closeRef} type="button" className="close-button" aria-label="关闭文物图片" onClick={onClose}>×</button>
      </div>
      <div className="artifact-image-frame">
        {loading && !failed && <span className="artifact-image-status">图片加载中…</span>}
        {!failed && <img src={image.src} alt={image.caption} referrerPolicy="no-referrer" onLoad={() => setLoading(false)} onError={() => { setFailed(true); setLoading(false); }} />}
        {failed && <span className="artifact-image-status">图片暂时无法加载（可能处于离线状态）</span>}
      </div>
      <p className="artifact-caption">{image.caption}</p>
      <p className="artifact-credit">© {image.credit} · {image.license}</p>
      <a className="artifact-source-link" href={image.page} target="_blank" rel="noopener noreferrer">在 Wikimedia Commons 查看原图页 ↗</a>
    </div>
  </div>;
}
