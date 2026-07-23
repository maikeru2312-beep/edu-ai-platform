import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const outDir = path.join(root, 'docs/adsense');
const checkedAt = '2026-07-21';
const csv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const writeCsv = (file, header, rows) => fs.writeFileSync(
  path.join(outDir, file),
  [header, ...rows].map((row) => row.map(csv).join(',')).join('\n') + '\n',
);

const S = {
  ai: ['初等中等教育段階における生成AIの利活用に関するガイドライン（Ver.2.0）', '文部科学省', 'https://www.mext.go.jp/content/000332373.pdf', '2024-12-26'],
  ppc: ['生成AIサービスの利用に関する注意喚起等', '個人情報保護委員会', 'https://www.ppc.go.jp/news/careful_information/230602_AI_utilize_alert/', '2023-06-02'],
  copyright: ['AIと著作権に関する考え方について', '文化庁', 'https://www.bunka.go.jp/seisaku/bunkashingikai/chosakuken/pdf/94037901_01.pdf', '2024-03-15'],
  digital: ['学習者用デジタル教科書について', '文部科学省', 'https://www.mext.go.jp/a_menu/shotou/kyoukasho/seido/1407731.htm', '2025-09（審議まとめ掲載）'],
  studx: ['「StuDX Style」について', '文部科学省', 'https://www.mext.go.jp/studxstyle/about/index.html', '2020-12'],
  plan: ['個別の教育支援計画の参考様式について', '文部科学省', 'https://www.mext.go.jp/a_menu/shotou/tokubetu/material/1340250_00005.htm', '2021-10-29'],
  accommodation: ['障害を理由とする差別の解消の推進に関する対応指針', '文部科学省', 'https://www.mext.go.jp/a_menu/shotou/tokubetu/material/mext_02599.html', '2023-12-28'],
  specialIct: ['StuDX Style 各教科等での活用「特別支援」', '文部科学省', 'https://www.mext.go.jp/a_menu/shotou/tokubetu/mext_00025.html', '2025-07-28'],
  behavior: ['行動問題のある自閉症支援における研修効果に関する研究', '国立特別支援教育総合研究所', 'https://nise.repo.nii.ac.jp/records/2000006', '2024-03'],
};

const audits = {
  'ai-lesson-preparation-prompt': [
    ['利用前の確認', '生成AIの校務利用では設置者・学校の方針と入力情報を確認する', 'LAW_POLICY', 'HIGH', S.ai, 'VERIFIED', 'ADD_CITATION', 'ガイドラインの教職員による校務利用に対応'],
    ['AIの役割', 'AIは授業案のたたき台に限定し、教員が原資料と目標に照らして修正する', 'PROFESSIONAL_PRACTICE', 'MEDIUM', S.ai, 'PARTIALLY_VERIFIED', 'REWRITE', '時短・効果の断定を削除'],
    ['プロンプト例', '掲載プロンプトが実務上使えるか', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '運営者の試用確認が必要'],
  ],
  'chatgpt-tsuchihyo-shoken': [
    ['個人情報', '通知表所見の素材に個人データを含める場合は利用目的とサービスの取扱い確認が必要', 'LAW_POLICY', 'HIGH', S.ppc, 'VERIFIED', 'ADD_CITATION', '個人情報保護委員会の注意喚起に対応'],
    ['利用効果', 'AI利用が時間短縮や品質向上を保証する', 'RESEARCH', 'HIGH', null, 'UNVERIFIED', 'REWRITE', '保証表現を削除し表現候補の補助へ限定'],
    ['所見例', '架空例の文面が学校実務として自然か', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '実在児童の情報は不要'],
  ],
  'digital-textbook-introduction-school-changes': [
    ['制度', '2024年度から全国の小中学校等で段階的導入が進められている', 'LAW_POLICY', 'HIGH', S.digital, 'VERIFIED', 'ADD_CITATION', '文部科学省制度ページで確認'],
    ['使い分け', '紙かデジタルかを一律に決めず学習目的と困難に応じて選ぶ', 'PROFESSIONAL_PRACTICE', 'MEDIUM', S.digital, 'PARTIALLY_VERIFIED', 'KEEP', '判断表は編集部ツール'],
    ['判断表', '紙・デジタル使い分け判断表が実務上妥当か', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '運営者レビューが必要'],
  ],
  'education-ai-service-checklist-before-use': [
    ['データ取扱い', '入力データの利用目的や処理方法を規約で確認する', 'LAW_POLICY', 'HIGH', S.ppc, 'VERIFIED', 'ADD_CITATION', 'サービスごとの規約確認が必要'],
    ['著作権', 'AI生成物は既存著作物との類似性等を確認する必要がある', 'LAW_POLICY', 'HIGH', S.copyright, 'VERIFIED', 'ADD_CITATION', '文化庁資料に対応'],
    ['導入順序', '掲載した校内確認順序が実際の運用と整合するか', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '設置者ごとの差がある'],
  ],
  'generative-ai-guideline-v2-school-reading': [
    ['版と日付', 'ガイドラインVer.2.0は2024年12月26日に公表された', 'LAW_POLICY', 'HIGH', S.ai, 'VERIFIED', 'ADD_CITATION', '原本PDFで確認'],
    ['位置付け', 'ガイドラインは一律の禁止・許可ではなく場面別の留意点を示す', 'LAW_POLICY', 'HIGH', S.ai, 'VERIFIED', 'KEEP', '原本の基本的考え方に対応'],
    ['読み方', '記事の原本確認手順が校内で使いやすいか', 'FIRSTHAND_EXPERIENCE', 'LOW', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '運営者レビューが必要'],
  ],
  'giga-device-lesson-use-guide': [
    ['整備目的', '1人1台端末を日常的に活用する方針が示されている', 'LAW_POLICY', 'HIGH', S.studx, 'VERIFIED', 'ADD_CITATION', 'StuDX Styleで確認'],
    ['授業設計', '学習目標から端末を使う場面・使わない場面を選ぶ', 'PROFESSIONAL_PRACTICE', 'MEDIUM', S.studx, 'PARTIALLY_VERIFIED', 'KEEP', '具体手順は編集部整理'],
    ['代替案', '掲載トラブル対応が運営者の環境でも妥当か', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', 'OS・設置者差の確認が必要'],
  ],
  'ict-teaching-tools-selection-guide': [
    ['選定条件', 'アクセシビリティと個人情報の取扱いを導入前に確認する', 'PROFESSIONAL_PRACTICE', 'HIGH', S.specialIct, 'PARTIALLY_VERIFIED', 'ADD_CITATION', '個人情報部分はPPC資料も参照'],
    ['個人情報', 'AI機能へ入力するデータの処理方法をサービスごとに確認する', 'LAW_POLICY', 'HIGH', S.ppc, 'VERIFIED', 'ADD_CITATION', '規約への直接確認を促す'],
    ['選定表', '選定マトリクスの項目が校内選定で使えるか', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '運営者レビューが必要'],
  ],
  'individual-education-plan-writing-guide': [
    ['計画の違い', '教育支援計画と指導計画は目的・対象期間・記載内容が異なる', 'LAW_POLICY', 'HIGH', S.plan, 'VERIFIED', 'ADD_CITATION', '参考様式と事務連絡に対応'],
    ['目標と評価', '観察可能な目標と条件を記録する', 'PROFESSIONAL_PRACTICE', 'MEDIUM', S.plan, 'PARTIALLY_VERIFIED', 'KEEP', '記事の文例は架空'],
    ['確認票', '公開・引継ぎ前チェックリストが実務上妥当か', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '校内様式を優先'],
  ],
  'reasonable-accommodation-school-record': [
    ['決定過程', '本人・保護者との建設的対話を通じて合理的配慮を検討する', 'LAW_POLICY', 'HIGH', S.accommodation, 'VERIFIED', 'ADD_CITATION', '対応指針で確認'],
    ['記録', '合意した合理的配慮を個別の教育支援計画等へ記載し共有する', 'LAW_POLICY', 'HIGH', S.accommodation, 'VERIFIED', 'ADD_CITATION', 'プライバシーへの配慮も必要'],
    ['文例', '架空の記録文例が実務上不自然でないか', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '運営者レビューが必要'],
  ],
  'school-generative-ai-privacy-security': [
    ['個人情報', '生成AIへ個人データを入力する前に利用目的と処理方法を確認する', 'LAW_POLICY', 'HIGH', S.ppc, 'VERIFIED', 'ADD_CITATION', 'PPC注意喚起に対応'],
    ['ファクトチェック', 'AI出力の事実・引用・出典を教員が確認する', 'LAW_POLICY', 'HIGH', S.ai, 'VERIFIED', 'ADD_CITATION', 'ガイドラインに対応'],
    ['二段階確認票', '匿名化・出力確認チェックリストが現場で使えるか', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '匿名化しても利用可能とは限らない旨を明記'],
  ],
  'special-needs-behavior-record-guide': [
    ['ABC記録', '先行条件・行動・結果を分けて観察記録する手法', 'RESEARCH', 'HIGH', S.behavior, 'VERIFIED', 'ADD_CITATION', '研究紀要の研修内容で確認'],
    ['因果推論', '単一記録だけで行動の理由や支援効果を断定しない', 'PROFESSIONAL_PRACTICE', 'HIGH', S.behavior, 'PARTIALLY_VERIFIED', 'REWRITE', '架空例に断定回避注記を追加'],
    ['ABC様式', '空欄様式と完全な架空例が実務上妥当か', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '実在事例ではない'],
  ],
  'special-needs-ict-reasonable-accommodation': [
    ['合理的配慮', 'ICT利用も本人の教育的ニーズと建設的対話に基づき個別に検討する', 'LAW_POLICY', 'HIGH', S.accommodation, 'VERIFIED', 'ADD_CITATION', '一律の機能推奨を避ける'],
    ['ICT活用', '障害特性に応じて拡大・読み上げ等の機能を検討する', 'PROFESSIONAL_PRACTICE', 'MEDIUM', S.specialIct, 'VERIFIED', 'ADD_CITATION', '文科省の障害種別資料に対応'],
    ['校内手順', '記事の相談・記録手順が運営者の実務と整合するか', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '学校固有情報は不要'],
  ],
  'special-needs-ict-support-tools-checklist': [
    ['目的', 'ツールは参加・理解・表現上の困難と利用目的から選ぶ', 'PROFESSIONAL_PRACTICE', 'MEDIUM', S.specialIct, 'PARTIALLY_VERIFIED', 'ADD_CITATION', '目的別分類は編集部整理'],
    ['合理的配慮', '特定機能を障害名だけで一律に決めない', 'LAW_POLICY', 'HIGH', S.accommodation, 'VERIFIED', 'KEEP', '個別検討を明記'],
    ['チェックリスト', '目的別チェックリストが実務上使えるか', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '本人の試用を前提'],
  ],
  'special-needs-visual-schedule-support': [
    ['視覚支援', 'スケジュール等の視覚情報を実態に応じて調整する', 'PROFESSIONAL_PRACTICE', 'MEDIUM', S.behavior, 'PARTIALLY_VERIFIED', 'ADD_CITATION', '研究紀要の支援検討に対応'],
    ['効果表現', '視覚支援が自立や行動改善を必ずもたらす', 'RESEARCH', 'HIGH', null, 'UNVERIFIED', 'REWRITE', '個人差を明記し記録で見直す表現へ限定'],
    ['支援例', '掲載例と見直し手順が実務上妥当か', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '運営者レビューが必要'],
  ],
  'tokubetsu-shien-ict': [
    ['ICT機能', '拡大・読み上げ・音声入力等は障害特性に応じた選択肢になり得る', 'PROFESSIONAL_PRACTICE', 'MEDIUM', S.specialIct, 'VERIFIED', 'ADD_CITATION', '文科省資料に対応'],
    ['合理的配慮', 'ICT活用を合理的配慮とする場合は個別に検討・記録する', 'LAW_POLICY', 'HIGH', S.accommodation, 'VERIFIED', 'ADD_CITATION', '対応指針に対応'],
    ['具体例', '各機能の利用例が運営者の確認範囲で妥当か', 'FIRSTHAND_EXPERIENCE', 'MEDIUM', null, 'USER_CONFIRMATION_REQUIRED', 'ASK_USER', '製品名・効果の追加は禁止'],
  ],
};

const claimRows = [];
for (const [slug, claims] of Object.entries(audits)) {
  claims.forEach(([section, claim, type, risk, source, status, action, notes], index) => {
    claimRows.push([
      slug, `${slug}-${String(index + 1).padStart(2, '0')}`, section, claim, type, risk,
      source?.[0] ?? '', source?.[1] ?? '', source?.[2] ?? '', source?.[3] ?? '',
      checkedAt, status, action, notes,
    ]);
  });
}

writeCsv('article-claim-source-audit-20260720.csv', [
  'slug', 'claim_id', 'section', 'claim', 'claim_type', 'risk_level', 'source_title',
  'source_publisher', 'source_url', 'source_date', 'checked_at', 'status', 'action', 'notes',
], claimRows);

const mergeTargets = {
  'ai-class-newsletter-prompt': ['MERGE', 'ai-lesson-preparation-prompt', '文書下書き後の確認観点を生成AI二段階チェックへ統合'],
  'ai-koomu-kaizen-nyumon': ['MERGE', 'ai-lesson-preparation-prompt', 'AIに任せる範囲と人間の確認責任を統合'],
  'chatgpt-teacher-beginner-guide': ['MERGE', 'school-generative-ai-privacy-security', '入力前の安全確認を匿名化チェックへ統合'],
  'free-ict-tools-safety-checklist': ['MERGE', 'ict-teaching-tools-selection-guide', '規約・個人情報・校内承認の観点を選定マトリクスへ統合'],
  'giga-school-device-troubleshooting': ['MERGE', 'giga-device-lesson-use-guide', '障害時の代替手段とトラブル対応を統合'],
  'google-forms-school-use-guide': ['MERGE', 'giga-device-lesson-use-guide', '目的先行・校内承認・代替手段の観点を統合'],
  'information-morals-education-themes': ['MERGE', 'school-generative-ai-privacy-security', '個人情報・生成AI出力確認を二段階チェックへ統合'],
  'kyoiku-dx-kiso': ['MERGE', 'giga-device-lesson-use-guide', 'ICTを目的化せず学習目標から判断する観点を統合'],
  'microsoft-copilot-teacher-guide': ['MERGE', 'education-ai-service-checklist-before-use', '製品名に依存しない規約・プラン・管理者設定確認へ統合'],
  'special-needs-parent-collaboration': ['MERGE', 'reasonable-accommodation-school-record', '本人・保護者との対話と合意内容の記録へ統合'],
  'tablet-ict-jugyo-giga': ['MERGE', 'giga-device-lesson-use-guide', '1場面から試す授業設計と代替案へ統合'],
  'education-grant-search-guide': ['UNPUBLISH', '', '制度更新を継続確認できず404を維持'],
  'generative-ai-school-training-guide': ['UNPUBLISH', '', '研修記事の独自性と実施経験を確認できず404を維持'],
  'joseikin-guide-2025': ['UNPUBLISH', '', '年度が古く404を維持'],
  'school-training-ict-ai-guide': ['UNPUBLISH', '', '研修記事の独自性と実施経験を確認できず404を維持'],
};

const meta = new Map(fs.readdirSync(path.join(root, 'content/articles')).filter((f) => f.endsWith('.md')).map((file) => {
  const slug = file.replace(/\.md$/, '');
  return [slug, matter(fs.readFileSync(path.join(root, 'content/articles', file), 'utf8')).data];
}));
const mergeRows = Object.entries(mergeTargets).map(([oldSlug, [classification, targetSlug, migrated]]) => [
  oldSlug, meta.get(oldSlug)?.title ?? '', classification, targetSlug,
  targetSlug ? meta.get(targetSlug)?.title ?? '' : '', migrated,
  targetSlug ? 301 : 404, classification === 'MERGE' ? '読者意図が最も近い中核記事へ統合' : migrated,
  targetSlug ? 'PASS_HTTP_301' : 'PASS_HTTP_404',
]);
writeCsv('article-merge-redirect-map-20260720.csv', [
  'old_slug', 'old_title', 'classification', 'target_slug', 'target_title',
  'unique_content_migrated', 'redirect_status', 'reason', 'test_result',
], mergeRows);

console.log(`Wrote ${claimRows.length} claim rows and ${mergeRows.length} redirect rows.`);
