import React, { useState, useMemo, useCallback } from 'react';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { Board } from './components/Board';
import { Timeline } from './components/Timeline';
import { CaseFile, Entity, EntityType, GraphNode, GraphLink, EntityFilterState } from './types';
import { analyzeDocument, askAssistant } from './services/geminiService';
import { LayoutDashboard, Clock, ShieldAlert } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<CaseFile[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [activeTab, setActiveTab] = useState<'board' | 'timeline'>('board');
  const [isChatProcessing, setIsChatProcessing] = useState(false);
  
  // Filters State
  const [filters, setFilters] = useState<EntityFilterState>({
    [EntityType.PERSON]: true,
    [EntityType.ORGANIZATION]: true,
    [EntityType.LOCATION]: true,
    [EntityType.DATE]: true,
    [EntityType.EVENT]: true,
  });

  const handleFilterChange = (type: EntityType) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleExport = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      files: files.map(f => ({ name: f.name, summary: f.content })),
      entities: entities
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepsource-investigation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [files, entities]);

  const handleFileUpload = useCallback(async (fileList: FileList) => {
    // Convert FileList to regular Array for stable iteration
    const filesArray = Array.from(fileList);
    
    const newFiles: CaseFile[] = filesArray.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: file.type,
      content: null,
      mimeType: file.type,
      uploadDate: Date.now(),
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Process files one by one
    for (let i = 0; i < newFiles.length; i++) {
      const fileData = newFiles[i];
      const originalFile = filesArray[i]; // Access original File object directly by index

      try {
        setFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, status: 'analyzing' } : f));

        // Convert to base64 for Gemini
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
             const result = reader.result as string;
             // Remove Data URL prefix
             const base64Raw = result.split(',')[1];
             resolve(base64Raw);
          };
          reader.onerror = reject;
          reader.readAsDataURL(originalFile);
        });

        const analysis = await analyzeDocument(fileData.name, base64, fileData.mimeType);

        // Merge Entities
        setEntities(prevEntities => {
          const newEntities = [...prevEntities];
          
          analysis.entities.forEach(extracted => {
            // Simple deduplication by name
            const existing = newEntities.find(e => e.name.toLowerCase() === extracted.name.toLowerCase() && e.type === extracted.type);
            
            if (existing) {
              if (!existing.sourceDocIds.includes(fileData.id)) {
                existing.sourceDocIds.push(fileData.id);
              }
              if (!existing.normalizedDate && extracted.normalizedDate) {
                  existing.normalizedDate = extracted.normalizedDate;
              }
            } else {
              newEntities.push({
                id: extracted.name.toLowerCase().replace(/\s+/g, '-'),
                name: extracted.name,
                type: extracted.type,
                sourceDocIds: [fileData.id],
                context: extracted.context,
                normalizedDate: extracted.normalizedDate
              });
            }
          });
          return newEntities;
        });

        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'analyzed', content: analysis.summary, base64: base64 } : f 
        ));

      } catch (err) {
        console.error(err);
        setFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, status: 'error' } : f));
      }
    }
  }, []);

  const handleChat = async (query: string) => {
    setIsChatProcessing(true);
    const contextFiles = files
      .filter(f => f.status === 'analyzed')
      .map(f => ({
        name: f.name,
        summary: f.content as string,
        extractedData: entities
            .filter(e => e.sourceDocIds.includes(f.id))
            .map(e => `${e.name} (${e.type})`)
            .join(', ')
      }));

    const response = await askAssistant(query, contextFiles);
    setIsChatProcessing(false);
    return response;
  };

  // Convert state to D3 format with Filters Applied
  const { nodes, links } = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // 1. Create Document Nodes
    files.forEach(f => {
      if (f.status === 'analyzed') {
        nodes.push({
            id: f.id,
            type: 'DOCUMENT',
            name: f.name,
            group: 1,
            val: 20,
            context: f.content as string
        });
      }
    });

    // 2. Create Entity Nodes and Links based on Filters
    entities.forEach(e => {
        // Check filter
        if (!filters[e.type]) return;

        // Only show entities connected to active analyzed documents
        const activeDocs = e.sourceDocIds.filter(id => files.find(f => f.id === id && f.status === 'analyzed'));
        
        if (activeDocs.length > 0) {
            nodes.push({
                id: e.id,
                type: e.type,
                name: e.name,
                group: 2,
                val: 10,
                context: e.context,
                sourceDocIds: e.sourceDocIds
            });

            activeDocs.forEach(docId => {
                links.push({
                    source: docId,
                    target: e.id,
                    value: 1
                });
            });
        }
    });

    return { nodes, links };
  }, [files, entities, filters]);

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-cyan-900 selection:text-cyan-100">
      
      <SidebarLeft 
        files={files} 
        onFileUpload={handleFileUpload} 
        filters={filters}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
      />

      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Top Toolbar */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950 z-10">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('board')}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-mono transition-all ${activeTab === 'board' ? 'bg-cyan-950 text-cyan-400 border border-cyan-900' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                INTELLIGENCE_BOARD
              </button>
              <button 
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-mono transition-all ${activeTab === 'timeline' ? 'bg-cyan-950 text-cyan-400 border border-cyan-900' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Clock className="w-4 h-4" />
                TIMELINE_VIEW
              </button>
           </div>
           
           <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
             <ShieldAlert className="w-4 h-4" />
             <span>LOCAL_MODE_ACTIVE</span>
           </div>
        </div>

        {/* Main Viewport */}
        <div className="flex-1 relative min-h-0">
          {activeTab === 'board' ? (
             <Board nodes={nodes} links={links} />
          ) : (
             <Timeline entities={entities} />
          )}
        </div>
      </div>

      <SidebarRight onSendMessage={handleChat} isProcessing={isChatProcessing} />
    </div>
  );
}

export default App;