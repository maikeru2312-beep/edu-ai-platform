import type { ComponentType } from 'react';
import AiUseBoundaryDiagram from '@/components/diagrams/AiUseBoundaryDiagram';
import PrivacyCheckFlow from '@/components/diagrams/PrivacyCheckFlow';
import ShokenDraftWorkflow from '@/components/diagrams/ShokenDraftWorkflow';
import SupportPlanCycle from '@/components/diagrams/SupportPlanCycle';
import BehaviorRecordThreeLayers from '@/components/diagrams/BehaviorRecordThreeLayers';

// 記事Markdown内の <!--diagram:key--> マーカーを図解コンポーネントに置き換える。
// 未知のキーは無視して本文のみ表示する（記事を壊さない）。
const DIAGRAMS: Record<string, ComponentType> = {
  'ai-use-boundary': AiUseBoundaryDiagram,
  'privacy-check-flow': PrivacyCheckFlow,
  'shoken-draft-workflow': ShokenDraftWorkflow,
  'support-plan-cycle': SupportPlanCycle,
  'behavior-record-three-layers': BehaviorRecordThreeLayers,
};

const MARKER_PATTERN = /<!--diagram:([a-z0-9-]+)-->/g;

const PROSE_CLASS =
  'prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded';

export default function ArticleBody({ contentHtml }: { contentHtml: string }) {
  // capture group付きsplit → [html, key, html, key, ..., html]
  const parts = contentHtml.split(MARKER_PATTERN);

  return (
    <div>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          const Diagram = DIAGRAMS[part];
          return Diagram ? <Diagram key={`diagram-${i}`} /> : null;
        }
        if (!part.trim()) return null;
        return (
          <div
            key={`html-${i}`}
            className={PROSE_CLASS}
            dangerouslySetInnerHTML={{ __html: part }}
          />
        );
      })}
    </div>
  );
}
