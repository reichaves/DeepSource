import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink, EntityType } from '../types';
import { X, Link, ExternalLink, FileText } from 'lucide-react';

interface BoardProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const Board: React.FC<BoardProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .call(d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
           g.attr("transform", event.transform);
        }));

    const g = svg.append("g");

    // Simulation setup
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    // Links
    const link = g.append("g")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 1.5);

    // Nodes Group
    const nodeGroup = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => {
        event.stopPropagation(); // Prevent clearing selection
        setSelectedNode(d);
      });

    // Node Circles
    nodeGroup.append("circle")
      .attr("r", (d) => d.type === 'DOCUMENT' ? 20 : 12)
      .attr("fill", (d) => {
        switch (d.type) {
            case 'DOCUMENT': return '#ffffff';
            case EntityType.PERSON: return '#22d3ee'; // Cyan
            case EntityType.ORGANIZATION: return '#f472b6'; // Pink
            case EntityType.LOCATION: return '#a78bfa'; // Purple
            case EntityType.DATE: return '#fbbf24'; // Amber
            case EntityType.EVENT: return '#ef4444'; // Red
            default: return '#94a3b8';
        }
      })
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 2)
      .attr("class", "cursor-pointer hover:stroke-white transition-all");

    // Labels
    nodeGroup.append("text")
      .text((d) => d.name)
      .attr("x", 24)
      .attr("y", 5)
      .attr("fill", "#cbd5e1")
      .style("font-family", "JetBrains Mono")
      .style("font-size", "11px")
      .style("pointer-events", "none")
      .style("text-shadow", "2px 2px 4px #000");


    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-950 relative overflow-hidden" onClick={() => setSelectedNode(null)}>
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-700 select-none pointer-events-none">
          <div className="text-center">
            <h3 className="text-2xl font-bold font-mono mb-2">AWAITING DATA</h3>
            <p>Upload documents to generate intelligence graph.</p>
          </div>
        </div>
      )}
      <svg ref={svgRef} className="w-full h-full cursor-move"></svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-md pointer-events-none">
        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Legend</h4>
        <div className="space-y-1.5">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span className="text-[10px] text-slate-300 font-mono">DOCUMENT</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-[10px] text-slate-300 font-mono">PERSON</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                <span className="text-[10px] text-slate-300 font-mono">ORGANIZATION</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span className="text-[10px] text-slate-300 font-mono">LOCATION</span>
            </div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-[10px] text-slate-300 font-mono">DATE</span>
            </div>
        </div>
      </div>

      {/* Floating Details Panel */}
      {selectedNode && (
        <div 
          className="absolute top-4 right-4 w-72 bg-slate-900/95 backdrop-blur border border-slate-700 shadow-2xl rounded-lg overflow-hidden z-30 animate-in fade-in slide-in-from-right-4 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-slate-800 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{selectedNode.name}</h3>
              <span className="text-xs font-mono text-cyan-400 uppercase mt-1 block">{selectedNode.type}</span>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-slate-500 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Context</h4>
              <p className="text-sm text-slate-300 italic border-l-2 border-slate-600 pl-3">
                "{selectedNode.context || 'No specific context snippet available.'}"
              </p>
            </div>

            {selectedNode.type !== 'DOCUMENT' && selectedNode.sourceDocIds && (
              <div>
                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Sources ({selectedNode.sourceDocIds.length})</h4>
                 <div className="space-y-1">
                   {selectedNode.sourceDocIds.map(id => (
                     <div key={id} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 p-1.5 rounded">
                       <FileText className="w-3 h-3" />
                       <span className="font-mono">DOC-{id.substring(0, 6)}</span>
                     </div>
                   ))}
                 </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800">
              <button className="w-full flex items-center justify-center gap-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800/30 p-2 rounded text-xs font-mono uppercase transition-colors">
                <Link className="w-3 h-3" />
                Manually Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};