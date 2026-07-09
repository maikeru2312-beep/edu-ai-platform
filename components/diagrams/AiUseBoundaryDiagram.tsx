import DiagramFigure from './DiagramFigure';

const ZONES = [
  {
    title: 'AIに任せてよい部分',
    tone: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-600',
    items: ['文章のたたき台づくり', '表現の言い換え・複数案出し', '形式・体裁を整える作業'],
    note: '前提：個人情報・校内情報を入力しない',
  },
  {
    title: '教師が判断する部分',
    tone: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-600',
    items: ['内容が事実と合っているか', '目の前の子どもに合うか', '最終的な文責・使うかどうか'],
    note: 'AIの出力をそのまま使わない',
  },
  {
    title: '校内ルールで確認する部分',
    tone: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-600',
    items: ['そもそも利用が認められているか', 'どの業務まで使ってよいか', '保護者・外部への説明方針'],
    note: '迷ったら管理職・教育委員会に確認',
  },
];

export default function AiUseBoundaryDiagram() {
  return (
    <DiagramFigure
      label="生成AI活用の役割分担図。AIに任せてよい部分（たたき台づくりなど）、教師が判断する部分（事実確認や最終判断）、校内ルールで確認する部分（利用可否や説明方針）の3つに分かれる。"
      caption="図：生成AIを校務で使うときの役割分担。「どこまでAIに任せるか」より先に、「何は人が引き受けるか」を決めておくと迷いにくくなります。"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ZONES.map((zone) => (
          <div key={zone.title} className={`rounded-lg border p-4 ${zone.tone}`}>
            <p className="flex items-center gap-2 mb-3">
              <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${zone.badge}`} />
              <span className="text-sm font-bold text-gray-900">{zone.title}</span>
            </p>
            <ul className="space-y-1.5 mb-3">
              {zone.items.map((item) => (
                <li key={item} className="text-xs text-gray-700 leading-relaxed pl-3 relative">
                  <span className="absolute left-0 text-gray-400">・</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-gray-500 border-t border-gray-200/70 pt-2">{zone.note}</p>
          </div>
        ))}
      </div>
    </DiagramFigure>
  );
}
