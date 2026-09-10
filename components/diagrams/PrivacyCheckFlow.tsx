import DiagramFigure from './DiagramFigure';

// 順序と用語は本文（ai-koomu-kaizen-nyumon の校務ゲート1〜2）に合わせる。
// 校内ルールの確認が最初（校務ゲート1）で、入力する情報の線引き（校務ゲート2）はその後。
// 「要配慮個人情報」は個人情報保護法上の類型、「重要性の高い情報」は文科省ガイドラインの語で、
// 成績や家庭状況はいずれかに当たりうるが同じものではない。本文が避けている「匿名化」の語は使わない。
const STEPS = [
  {
    q: '校内ルール・設置者のガイドラインで、その環境での利用が認められているか',
    note: 'ルールが見つからないときは、入力する前に情報担当・管理職へ（校務ゲート1）',
  },
  {
    q: '個人名・学校名・地域名が入っていないか',
    note: '名前を消すだけでなく、出席番号・イニシャルの組み合わせにも注意',
  },
  {
    q: '障害や診断名などの要配慮個人情報、成績や家庭状況などの重要性の高い情報が含まれていないか',
    note: '「配慮が必要な子」と分かる記述は、要配慮個人情報に当たる場合がある（校務ゲート2）',
  },
  {
    q: '名前を消したあとも、状況から個人が特定されないか',
    note: '「学年に一人しかいない状況」の描写は、名前がなくても特定につながる',
  },
];

export default function PrivacyCheckFlow() {
  return (
    <DiagramFigure
      label="AIに入力してよい情報かを確認する流れ。校内ルールでの利用可否、個人名の有無、要配慮個人情報や重要性の高い情報の有無、名前を消しても特定されないかを順に確認し、ひとつでも引っかかれば入力しない。"
      caption="図：AIサービスに入力する前の確認フロー。上から順に確認し、ひとつでも「はい」と言い切れない項目があれば、その情報は入力しない判断が安全です。"
    >
      <ol className="space-y-0">
        {STEPS.map((step, i) => (
          <li key={step.q} className="relative pl-10 pb-4 last:pb-0">
            {i < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-[13px] top-7 bottom-0 w-px bg-blue-200"
              />
            )}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center"
            >
              {i + 1}
            </span>
            <p className="text-sm font-medium text-gray-900 leading-snug pt-1">{step.q}</p>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{step.note}</p>
          </li>
        ))}
      </ol>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <p className="text-xs leading-relaxed bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-gray-700">
          <span className="font-bold text-blue-700">すべて確認できた →</span>{' '}
          校内ルールの範囲で入力する
        </p>
        <p className="text-xs leading-relaxed bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
          <span className="font-bold text-gray-700">ひとつでも不安が残る →</span>{' '}
          入力せず、AIを使わない方法か抽象化した依頼に切り替える
        </p>
      </div>
    </DiagramFigure>
  );
}
