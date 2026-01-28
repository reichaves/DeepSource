import React from 'react';
import { Entity, EntityType } from '../types';
import { Calendar, Clock } from 'lucide-react';

interface TimelineProps {
  entities: Entity[];
}

export const Timeline: React.FC<TimelineProps> = ({ entities }) => {
  
  // Filter only date entities and sort them
  const dateEntities = entities
    .filter(e => e.type === EntityType.DATE)
    .map(e => {
       let time = 0;
       // Often normalizedDate is like "YYYY-MM-DD"
       const dateStr = (e as any).normalizedDate || e.name;
       const parsed = Date.parse(dateStr);
       if (!isNaN(parsed)) {
         time = parsed;
       }
       return { ...e, _time: time, _displayDate: dateStr };
    })
    .sort((a, b) => a._time - b._time);

  if (dateEntities.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950">
        <Clock className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-mono text-sm">NO TEMPORAL DATA EXTRACTED</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col">
      <div className="p-6 border-b border-slate-800 bg-slate-950 z-10">
        <h2 className="text-lg font-mono font-bold text-cyan-400 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          CHRONOLOGICAL RECONSTRUCTION
        </h2>
        <p className="text-xs text-slate-500 font-mono mt-1">
          {dateEntities.length} TEMPORAL ANCHORS IDENTIFIED
        </p>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden relative bg-slate-950 custom-scrollbar">
        <div className="h-full flex items-center px-12 min-w-max gap-16 relative">
          
          {/* Central Timeline Line */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -z-0"></div>

          {dateEntities.map((entity, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={entity.id} className={`relative flex flex-col items-center w-64 flex-shrink-0 z-10 ${isEven ? '-translate-y-24' : 'translate-y-24'}`}>
                
                {/* Connection Line */}
                <div className={`absolute h-12 w-px bg-slate-700 left-1/2 -translate-x-1/2 ${isEven ? 'top-full' : 'bottom-full'}`}></div>
                
                {/* Dot on Line */}
                <div className={`absolute w-4 h-4 rounded-full border-2 border-slate-950 bg-amber-500 left-1/2 -translate-x-1/2 ${isEven ? 'top-[calc(100%+40px)]' : 'bottom-[calc(100%+40px)]'}`}></div>

                {/* Card */}
                <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded hover:border-amber-500/50 transition-colors group shadow-xl">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                    <span className="font-mono text-amber-400 font-bold text-sm">
                      {entity._displayDate}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono bg-slate-950 px-1.5 py-0.5 rounded">
                      REF-{index + 1}
                    </span>
                  </div>
                  
                  <p className="text-slate-300 text-xs italic font-serif leading-relaxed opacity-80 group-hover:opacity-100">
                    "{entity.context || 'Context missing'}"
                  </p>
                </div>
              </div>
            );
          })}
          
          {/* Padding at end */}
          <div className="w-12"></div>
        </div>
      </div>
    </div>
  );
};