import React from 'react';
import { GraduationCap, ExternalLink } from 'lucide-react';

const SAP_LEARNING: Record<string, string[]> = {
  'java-developer': ['SAP BTP: Develop extensions with CAP', 'Advanced SAP UI5 Development'],
  'python-developer': ['Create Your First App on Cloud Foundry', 'SAP Generative AI Hub: prompts and LLMs'],
  'web-developer': ['Advanced SAP UI5 Development', 'Create an Application with SAP Build Apps'],
  'ai-ml-engineer': ['SAP Generative AI Hub: prompts and LLMs', 'Provisioning data to SAP HANA Cloud'],
  'data-analyst': ['Exploring SAP Analytics Cloud', 'SAP Analytics Cloud: Story Design'],
  'data-scientist': ['SAP Analytics Cloud: Modeling and Data Transformation', 'SAP HANA Cloud: Modeling'],
  'business-analyst': ['SAP Analytics Cloud: Story Design', 'Applying AI-powered Visualizations in SAP Analytics Cloud'],
  'cloud-engineer': ['Get Started with SAP Business Technology Platform', 'Create Your First App on Cloud Foundry'],
  'devops-engineer': ['Create Your First App on Cloud Foundry', 'SAP HANA Installing and Administering'],
  'cybersecurity-analyst': ['Get Started with SAP Business Technology Platform', 'SAP HANA Installing and Administering'],
};

const HUB_URL = 'https://learning.sap.com';

export const SapLearningHubPanel: React.FC<{ roleId: string }> = ({ roleId }) => {
  const items = SAP_LEARNING[roleId] ?? ['Get Started with SAP Business Technology Platform'];
  return (
    <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
      <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-2">
        <GraduationCap className="w-4 h-4" />
        SAP Learning Hub (Student Edition): recommended for this role
      </div>
      <ul className="space-y-1.5">
        {items.map((title) => (
          <li key={title}>
            <a
              href={HUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-blue-800 hover:underline flex items-center gap-1.5"
            >
              <ExternalLink className="w-3 h-3" />
              {title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};