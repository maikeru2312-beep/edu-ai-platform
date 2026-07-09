import DiagramFigure from './DiagramFigure';

const STEPS = [
  { title: '実態把握', detail: '事実・記録から今の姿をつかむ' },
  { title: '目標', detail: '評価できる具体さで設定する' },
  { title: '手立て', detail: '誰が・いつ・何をするかまで書く' },
  { title: '評価', detail: 'できた/できないではなく変化を見る' },
  { title: '次の調整', detail: '目標と手立てを見直す' },
];

export default function SupportPlanCycle() {
  return (
    <DiagramFigure
      label="個別の指導計画のサイクル図。実態把握、目標、手立て、評価、次の調整の5段階が順につながり、次の調整から再び実態把握へ戻って循環する。"
      caption="図：支援計画・指導計画のサイクル。書いて終わりの書類ではなく、「評価」から「次の調整」を経てもう一度実態把握に戻る、回し続ける仕組みとして扱います。"
    >
      <ol className="flex flex-col sm:flex-row sm:items-stretch gap-2">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col sm:flex-1 sm:flex-row sm:items-stretch gap-2">
            <div className="flex-1 rounded-lg border border-blue-200 bg-blue-50/60 p-3">
              <p className="text-xs font-bold text-gray-900 mb-1">
                <span className="text-blue-500 mr-1">{i + 1}.</span>
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
      <p className="mt-3 flex items-center gap-2 text-[11px] text-gray-500">
        <span aria-hidden="true" className="text-blue-400">⟲</span>
        「5. 次の調整」で終わらせず、変化した実態の把握（1）へ戻って回し続けます
      </p>
    </DiagramFigure>
  );
}
