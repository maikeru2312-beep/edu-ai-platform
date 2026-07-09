import DiagramFigure from './DiagramFigure';

const STEPS = [
  { title: '事実メモ', detail: '個人名を入れず、行動・成長の事実だけを書き出す', ai: true },
  { title: 'AIで下書き', detail: '文体・分量を指定してたたき台を作らせる', ai: true },
  { title: '教師が書き直す', detail: '事実と照合し、その子に合う言葉に直す', ai: false },
  { title: '校内チェック', detail: '学年・管理職の確認ルートに載せる', ai: false },
  { title: '通知表へ', detail: '文責は教師。AIが書いた文のままにしない', ai: false },
];

export default function ShokenDraftWorkflow() {
  return (
    <DiagramFigure
      label="通知表所見をAIと分担して作る流れ。匿名の事実メモを作り、AIで下書きし、教師が事実と照合して書き直し、校内チェックを経て通知表に載せる。AIに渡すのは匿名化した事実メモまで。"
      caption="図：所見づくりの分担フロー。AIが関わるのは前半の2段階だけで、事実との照合・子どもに合う表現への修正・最終責任は教師側に残ります。"
    >
      <ol className="flex flex-col sm:flex-row sm:items-stretch gap-2">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col sm:flex-1 sm:flex-row sm:items-stretch gap-2">
            <div
              className={`flex-1 rounded-lg border p-3 ${
                step.ai ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <p className="text-xs font-bold text-gray-900 mb-1">
                <span className="text-gray-400 mr-1">{i + 1}.</span>
                {step.title}
              </p>
              <p className="text-[11px] text-gray-600 leading-relaxed">{step.detail}</p>
            </div>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="self-center text-gray-300 text-sm rotate-90 sm:rotate-0 shrink-0"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block w-3 h-3 rounded-sm bg-blue-50 border border-blue-200" />
          AIが関わる段階（匿名化した情報のみ）
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block w-3 h-3 rounded-sm bg-gray-50 border border-gray-200" />
          教師・学校が担う段階
        </span>
      </div>
    </DiagramFigure>
  );
}
