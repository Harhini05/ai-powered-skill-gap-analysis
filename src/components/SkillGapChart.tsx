import React, { useState } from 'react';
import { CareerGapReport } from '../types';
import { BarChart2, ShieldCheck, AlertTriangle, XCircle, Activity } from 'lucide-react';

interface SkillGapChartProps {
  report: CareerGapReport;
}

export const SkillGapChart: React.FC<SkillGapChartProps> = ({ report }) => {
  const [chartMode, setChartMode] = useState<'bars' | 'radar'>('bars');

  const { chartData, overallReadinessScore, role } = report;

  // Level labels
  const levelLabels = ['None', 'Beginner', 'Intermediate', 'Advanced'];

  // Radar chart math
  const numAxes = chartData.length;
  const radius = 110;
  const centerX = 150;
  const centerY = 140;

  const getCoordinates = (index: number, value: number, maxValue: number = 3) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (value / maxValue) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate radar polygon points
  const studentPolygonPoints = chartData
    .map((item, idx) => {
      const { x, y } = getCoordinates(idx, item.studentValue);
      return `${x},${y}`;
    })
    .join(' ');

  const requiredPolygonPoints = chartData
    .map((item, idx) => {
      const { x, y } = getCoordinates(idx, item.requiredValue);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="text-xs font-mono font-semibold text-indigo-600 uppercase tracking-wider">
            Visual Competency Matrix
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {role.title} Skill-Gap Benchmark Chart
          </h3>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('bars')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 focus:outline-none ${
              chartMode === 'bars'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Level Comparison</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode('radar')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 focus:outline-none ${
              chartMode === 'radar'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Competency Radar</span>
          </button>
        </div>
      </div>

      {/* Legend & Summary Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs p-3 bg-slate-50 rounded-lg border border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
            <span className="text-slate-700 font-medium">Student Level</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-slate-400 inline-block" />
            <span className="text-slate-700 font-medium">Required Benchmark</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="text-slate-500">Needs Level Upgrade</span>
          </div>
        </div>

        <div className="font-mono text-xs">
          Readiness Score: <span className="font-bold text-indigo-700 text-sm">{overallReadinessScore}%</span>
        </div>
      </div>

      {/* Render Chart Mode: Side-by-Side Level Bars */}
      {chartMode === 'bars' && (
        <div className="space-y-4">
          {chartData.map((item, idx) => {
            const studentPct = (item.studentValue / 3) * 100;
            const requiredPct = (item.requiredValue / 3) * 100;
            const isMet = item.status === 'mastered';
            const isImprovement = item.status === 'improvement_needed';
            const isMissing = item.status === 'missing';

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {isMet && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {isImprovement && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                    {isMissing && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                    
                    <span className="font-bold text-slate-800">{item.skill}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className={isMet ? 'text-emerald-700 font-semibold' : isImprovement ? 'text-amber-700' : 'text-slate-400'}>
                      You: {levelLabels[item.studentValue]} ({item.studentValue}/3)
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">
                      Req: {levelLabels[item.requiredValue]} ({item.requiredValue}/3)
                    </span>
                  </div>
                </div>

                {/* Comparative Dual Bar */}
                <div className="relative h-6 bg-slate-100 rounded-md overflow-hidden flex items-center p-1 border border-slate-200">
                  {/* Target Benchmark Marker Background */}
                  <div
                    className="absolute top-0 bottom-0 bg-slate-300/60 border-r-2 border-slate-700 transition-all duration-300"
                    style={{ width: `${requiredPct}%` }}
                    title={`Required Benchmark: ${levelLabels[item.requiredValue]}`}
                  />

                  {/* Student Earned Bar */}
                  <div
                    className={`relative h-4 rounded-xs transition-all duration-500 ${
                      isMet 
                        ? 'bg-emerald-500' 
                        : isImprovement 
                        ? 'bg-amber-500' 
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${studentPct}%` }}
                  />

                  {/* Status Text overlay inside bar */}
                  <div className="absolute right-2 text-[10px] font-medium text-slate-600">
                    {isMet && '✓ Benchmark Met'}
                    {isImprovement && `▲ Gap: -${item.requiredValue - item.studentValue} Level`}
                    {isMissing && '✕ Missing Competency'}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Scale Axis */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>0: None / Not Studied</span>
            <span>1: Beginner (Syntax & Basics)</span>
            <span>2: Intermediate (Applied Projects)</span>
            <span>3: Advanced (Production & System Design)</span>
          </div>
        </div>
      )}

      {/* Render Chart Mode: Radar / Spider Web */}
      {chartMode === 'radar' && (
        <div className="flex flex-col items-center justify-center py-4">
          <svg
            viewBox="0 0 300 280"
            className="w-full max-w-[360px] h-auto overflow-visible"
          >
            {/* Concentric Grid Rings */}
            {[1, 2, 3].map((ring) => {
              const ringPoints = chartData
                .map((_, i) => {
                  const { x, y } = getCoordinates(i, ring);
                  return `${x},${y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={ring}
                  points={ringPoints}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={ring === 3 ? 'none' : '2,2'}
                />
              );
            })}

            {/* Axes Spoke Lines */}
            {chartData.map((_, i) => {
              const { x, y } = getCoordinates(i, 3);
              return (
                <line
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              );
            })}

            {/* Target Role Requirement Area (Slate Blueprint) */}
            <polygon
              points={requiredPolygonPoints}
              fill="rgba(100, 116, 139, 0.15)"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />

            {/* Student Current Competency Area (Indigo Accent) */}
            <polygon
              points={studentPolygonPoints}
              fill="rgba(79, 70, 229, 0.28)"
              stroke="#4f46e5"
              strokeWidth="2"
            />

            {/* Data Points on vertices */}
            {chartData.map((item, i) => {
              const { x, y } = getCoordinates(i, item.studentValue);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#4f46e5"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Outer Labels */}
            {chartData.map((item, i) => {
              const { x, y, angle } = getCoordinates(i, 3.6);
              // text anchor based on angle
              let textAnchor: 'start' | 'end' | 'middle' = 'middle';
              if (Math.cos(angle) > 0.3) textAnchor = 'start';
              if (Math.cos(angle) < -0.3) textAnchor = 'end';

              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  className="text-[9px] font-sans font-semibold fill-slate-700"
                >
                  {item.skill}
                </text>
              );
            })}
          </svg>

          <div className="flex items-center gap-6 text-xs text-slate-500 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-600/30 border border-indigo-600 inline-block" />
              <span>Student Footprint</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-400/20 border border-slate-600 border-dashed inline-block" />
              <span>Target Role Benchmark</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
