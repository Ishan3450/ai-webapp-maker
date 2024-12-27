import React from 'react';
import { CheckCircle, Loader2, Circle } from 'lucide-react';
import { Step, StepType } from '../types';

interface StepsListProps {
  steps: Step[];
}

export function StepsList({ steps }: StepsListProps) {

  const getStatusIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'executing':
        return <Loader2 className="text-blue-500 animate-spin" size={20} />;
      default:
        return <Circle className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="bg-gray-800 h-full flex flex-col">
      <div className="px-4 py-2 text-lg font-semibold border-b border-gray-700 flex items-center gap-2">
        Steps
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start space-x-3">
              {getStatusIcon(step.status)}
              <div>
                <p className="text-sm text-gray-200">{step.type === StepType.RunScript ? <span className='flex items-center gap-1'>Command: <span className='text-xs bg-slate-100 rounded p-1 text-black'>{step.code}</span></span> : step.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}