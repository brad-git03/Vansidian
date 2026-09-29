import React, { useMemo, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Handle,
  MarkerType,
  Node,
  NodeProps,
  Position,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BriefcaseBusiness, Building2, Cpu, FileCheck2, ShieldCheck, Wallet } from 'lucide-react';
import type { PipelineStage } from '../hooks/useMidnight';

type FlowNodeData = { title: string; subtitle: string; boundary: string; icon: React.ElementType; tone: 'private' | 'wallet' | 'chain' | 'result'; active?: boolean; complete?: boolean };
type ArchitectureNode = Node<FlowNodeData, 'architecture'>;

const toneClasses = {
  private: 'border-[#5a4daf] bg-[#1b1b4a] text-[#a995ff]',
  wallet: 'border-[#496b9f] bg-[#142943] text-[#86b8ff]',
  chain: 'border-[#277067] bg-[#123b3a] text-[#45e1cb]',
  result: 'border-[#42682e] bg-[#1a331f] text-[#b9ed68]',
};

const ArchitectureNodeView = ({ data }: NodeProps<ArchitectureNode>) => {
  const Icon = data.icon;
  return <div className={`min-w-[170px] rounded-xl border p-4 shadow-[0_16px_40px_rgba(0,0,0,.22)] transition ${toneClasses[data.tone]} ${data.active ? 'ring-2 ring-current ring-offset-4 ring-offset-[#081126]' : ''} ${data.complete ? 'brightness-110' : ''}`}>
    <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-0 !bg-current" />
    <Handle type="target" position={Position.Top} id="top-target" className="!h-2 !w-2 !border-0 !bg-current" />
    <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-black/20"><Icon className="h-5 w-5" /></span><div><p className="text-sm font-semibold text-white">{data.title}</p><p className="mt-0.5 text-[10px] text-[#aab5d2]">{data.subtitle}</p></div></div>
    <p className="mt-4 text-[9px] font-semibold uppercase tracking-[.16em] opacity-80">{data.boundary}</p>
    <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-0 !bg-current" />
    <Handle type="source" position={Position.Bottom} id="bottom-source" className="!h-2 !w-2 !border-0 !bg-current" />
  </div>;
};

const nodeTypes = { architecture: ArchitectureNodeView };

const stageIndex: Record<PipelineStage, number> = { idle: 0, witness: 1, proving: 2, signing: 3, submitting: 4, confirmed: 5 };

export const PayrollArchitectureFlow: React.FC<{ stage: PipelineStage; isConnected: boolean }> = ({ stage, isConnected }) => {
  const [selected, setSelected] = useState('engine');
  const current = stageIndex[stage];

  const nodes = useMemo<ArchitectureNode[]>(() => {
    const definitions: Array<[string, number, number, FlowNodeData, number]> = [
      ['payroll', 20, 210, { title: 'Payroll team', subtitle: 'Private roster', boundary: 'Authorized input', icon: BriefcaseBusiness, tone: 'private' }, 1],
      ['engine', 300, 210, { title: 'Local ZK engine', subtitle: 'Witness + proof', boundary: 'Private · browser', icon: Cpu, tone: 'private' }, 2],
      ['wallet', 300, 10, { title: 'Lace wallet', subtitle: 'Authorization', boundary: 'Wallet boundary', icon: Wallet, tone: 'wallet' }, 3],
      ['contract', 585, 210, { title: 'Midnight contract', subtitle: 'Verify + settle', boundary: 'Public · on-chain', icon: ShieldCheck, tone: 'chain' }, 4],
      ['employer', 870, 90, { title: 'Employer view', subtitle: 'Confirmation', boundary: 'Verified result', icon: Building2, tone: 'result' }, 5],
      ['auditor', 870, 330, { title: 'Auditor view', subtitle: 'Evidence', boundary: 'Selective disclosure', icon: FileCheck2, tone: 'result' }, 5],
    ];
    return definitions.map(([id, x, y, data, index]) => ({ id, type: 'architecture', position: { x, y }, data: { ...data, active: current === index, complete: current > index || (id === 'payroll' && isConnected) }, draggable: false, selectable: true }));
  }, [current, isConnected]);

  const edges = useMemo<Edge[]>(() => {
    const activeColor = '#8f78ff';
    const chainColor = '#31dec8';
    const make = (id: string, source: string, target: string, label: string, index: number, extra: Partial<Edge> = {}): Edge => ({ id, source, target, label, type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 }, style: { stroke: current >= index ? (index >= 4 ? chainColor : activeColor) : '#394462', strokeWidth: current === index ? 2.5 : 1.5, opacity: current + 1 >= index ? 1 : .55 }, labelStyle: { fill: '#c4cceb', fontSize: 10, fontWeight: 600 }, labelBgStyle: { fill: '#101a32', fillOpacity: .96 }, labelBgPadding: [7, 4], labelBgBorderRadius: 6, ...extra });
    return [
      make('roster', 'payroll', 'engine', 'Private roster', 1),
      make('prove', 'engine', 'wallet', 'Request signature', 3, { sourceHandle: 'bottom-source', targetHandle: 'top-target' }),
      make('submit', 'wallet', 'contract', 'Proof + commitment', 4, { sourceHandle: 'bottom-source', targetHandle: 'top-target' }),
      make('confirm', 'contract', 'employer', 'Settlement confirmed', 5),
      make('audit', 'contract', 'auditor', 'Audit evidence', 5),
    ];
  }, [current]);

  const selectedNode = nodes.find((node) => node.id === selected) ?? nodes[1];

  return <section className="py-12 sm:py-20" aria-labelledby="architecture-flow-title">
    <div className="mb-8 max-w-3xl"><p className="text-[10px] font-semibold uppercase tracking-[.3em] text-[#a899ff]">Interactive architecture</p><h2 id="architecture-flow-title" className="mt-3 text-3xl font-bold tracking-[-.04em] text-white sm:text-4xl">Follow a private payroll proof through the system.</h2><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">Animated paths show the information boundary at each stage. Select a node to inspect its responsibility.</p></div>

    <div className="hidden overflow-hidden rounded-2xl border border-[var(--border)] bg-[#081126] md:block">
      <div className="h-[570px]" aria-label="Interactive Vansidian payroll architecture diagram">
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodeClick={(_, node) => setSelected(node.id)} fitView fitViewOptions={{ padding: .18 }} minZoom={.55} maxZoom={1.25} nodesDraggable={false} nodesConnectable={false} edgesReconnectable={false} elementsSelectable panOnDrag zoomOnScroll={false} zoomOnPinch deleteKeyCode={null} colorMode="dark">
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#263553" />
          <Controls showInteractive={false} position="bottom-left" />
        </ReactFlow>
      </div>
      <div className="border-t border-[var(--border)] bg-[#0b152a] px-6 py-4" aria-live="polite"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4"><span className="text-sm font-semibold text-white">{selectedNode.data.title}</span><span className="text-xs text-[#9eabd0]">{selectedNode.data.subtitle} · {selectedNode.data.boundary}</span></div></div>
    </div>

    <div className="space-y-3 md:hidden">{nodes.map((node, index) => { const Icon = node.data.icon; return <div key={node.id} className={`flex gap-4 rounded-xl border p-4 ${toneClasses[node.data.tone]}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-black/20"><Icon className="h-5 w-5" /></span><div><p className="text-sm font-semibold text-white">0{index + 1} · {node.data.title}</p><p className="mt-1 text-xs text-[#aab5d2]">{node.data.subtitle}</p><p className="mt-2 text-[9px] uppercase tracking-[.16em] opacity-80">{node.data.boundary}</p></div></div>; })}</div>
  </section>;
};
