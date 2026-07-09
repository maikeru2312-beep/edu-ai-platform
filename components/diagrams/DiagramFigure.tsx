import type { ReactNode } from 'react';

type Props = {
  /** スクリーンリーダー向けの図解全体の説明（alt相当） */
  label: string;
  /** 図の下に表示するキャプション */
  caption: string;
  children: ReactNode;
};

export default function DiagramFigure({ label, caption, children }: Props) {
  return (
    <figure className="not-prose my-10 bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
      <div role="img" aria-label={label}>
        {children}
      </div>
      <figcaption className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}
