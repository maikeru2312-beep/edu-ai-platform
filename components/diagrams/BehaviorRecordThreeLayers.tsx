import DiagramFigure from './DiagramFigure';

const LAYERS = [
  {
    title: '事実',
    sub: '見たまま・数えられること',
    example: '「3時間目の開始5分後、プリントが配られた直後に席を離れた」',
    tone: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-600',
  },
  {
    title: '解釈',
    sub: '事実から考えたこと（事実と区別して書く）',
    example: '「課題の難易度が合っていない可能性。開始直後に集中が切れる傾向か」',
    tone: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-600',
  },
  {
    title: '次の支援',
    sub: '解釈をもとに、次に試すこと',
    example: '「最初の1問を一緒に解いてから取り組ませてみる」',
    tone: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-600',
  },
];

export default function BehaviorRecordThreeLayers() {
  return (
    <DiagramFigure
      label="行動記録を3つの層に分ける図。第1層は事実（見たまま・数えられること）、第2層は解釈（事実から考えたこと）、第3層は次の支援（次に試すこと）。層を混ぜずに書き分ける。"
      caption="図：行動記録の3層。記入例はすべて架空のものです。「事実」と「解釈」を混ぜないことが、引き継ぎ・ケース会議・保護者との共有で使える記録の条件になります。"
    >
      <div className="space-y-2">
        {LAYERS.map((layer, i) => (
          <div key={layer.title} className={`rounded-lg border p-4 ${layer.tone}`}>
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1.5">
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold shrink-0 self-center ${layer.badge}`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-sm font-bold text-gray-900">{layer.title}</span>
              <span className="text-xs text-gray-500">{layer.sub}</span>
            </p>
            <p className="text-xs text-gray-700 leading-relaxed pl-7">{layer.example}</p>
          </div>
        ))}
      </div>
    </DiagramFigure>
  );
}
