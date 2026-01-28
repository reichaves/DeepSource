import React, { useRef } from 'react';
import { CaseFile, EntityType, EntityFilterState } from '../types';
import { Upload, FileText, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, File, Download, Filter } from 'lucide-react';

interface SidebarLeftProps {
  files: CaseFile[];
  onFileUpload: (files: FileList) => void;
  filters: EntityFilterState;
  onFilterChange: (type: EntityType) => void;
  onExport: () => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({ 
  files, 
  onFileUpload, 
  filters, 
  onFilterChange,
  onExport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getIcon = (mimeType: string) => {
    if (mimeType.includes('image')) return <ImageIcon className="w-4 h-4 text-cyan-400" />;
    if (mimeType.includes('pdf')) return <FileText className="w-4 h-4 text-red-400" />;
    return <File className="w-4 h-4 text-gray-400" />;
  };

  const getStatusIcon = (status: CaseFile['status']) => {
    switch (status) {
      case 'analyzing': return <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />;
      case 'analyzed': return <CheckCircle className="w-4 h-4 text-cyan-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 border-2 border-slate-700 rounded-full" />;
    }
  };

  return (
    <div className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full z-20">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <h1 className="text-xl font-bold font-mono tracking-tighter text-cyan-400 mb-1">DEEP<span className="text-white">SOURCE</span></h1>
        <p className="text-xs text-slate-500 font-mono">SECURE INVESTIGATIVE ENV</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        
        {/* Evidence Locker Section */}
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Evidence Locker</h2>
            <span className="text-xs text-slate-600 font-mono">{files.length} DOCS</span>
          </div>

          <div className="space-y-2 mb-6">
            {files.map((file) => (
              <div key={file.id} className="bg-slate-900 border border-slate-800 p-3 rounded-md hover:border-slate-700 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {getIcon(file.mimeType)}
                    <span className="text-sm text-slate-300 font-mono truncate" title={file.name}>{file.name}</span>
                  </div>
                  <div title={file.status}>
                    {getStatusIcon(file.status)}
                  </div>
                </div>
              </div>
            ))}

            {files.length === 0 && (
              <div className="border-2 border-dashed border-slate-800 rounded-lg p-6 text-center hover:bg-slate-900/30 transition-colors">
                <p className="text-slate-600 text-xs mb-2">DRAG & DROP OR UPLOAD</p>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <input 
            type="file" 
            multiple 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
            accept=".txt,.md,.pdf,.jpg,.jpeg,.png,.json"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2 rounded transition-all font-mono text-xs uppercase tracking-wide mb-8"
          >
            <Upload className="w-3 h-3" />
            Add Evidence
          </button>

        </div>

        <div className="w-full h-px bg-slate-800 mb-6"></div>

        {/* Filters Section */}
        <div className="p-4 pt-0">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-3 h-3 text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entity Filters</h2>
          </div>
          
          <div className="space-y-3">
            {[EntityType.PERSON, EntityType.ORGANIZATION, EntityType.LOCATION, EntityType.EVENT].map((type) => (
              <label key={type} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    type === EntityType.PERSON ? 'bg-cyan-400' :
                    type === EntityType.ORGANIZATION ? 'bg-pink-400' :
                    type === EntityType.LOCATION ? 'bg-purple-400' :
                    'bg-red-400'
                  }`} />
                  <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200 transition-colors capitalize">
                    {type.toLowerCase()}s
                  </span>
                </div>
                <input 
                  type="checkbox" 
                  checked={filters[type]} 
                  onChange={() => onFilterChange(type)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-3 h-3" 
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
        <button 
          onClick={onExport}
          disabled={files.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800/50 p-3 rounded transition-all font-mono text-xs uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export Intelligence
        </button>
      </div>
    </div>
  );
};