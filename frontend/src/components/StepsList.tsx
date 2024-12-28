import React from "react";
import { CheckCircle, Loader2, Circle } from "lucide-react";
import { Step, StepType } from "../types";

interface StepsListProps {
  steps: Step[];
  userPrompt: string;
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitUserPrompt: () => void;
  loading: boolean;
}

export function StepsList({
  steps,
  userPrompt,
  setUserPrompt,
  handleSubmitUserPrompt,
  loading,
}: StepsListProps) {
  const getStatusIcon = (status: Step["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-500" size={20} />;
      case "executing":
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
              <div>{getStatusIcon(step.status)}</div>
              <div>
                <p className="text-sm text-gray-200">
                  {step.type === StepType.RunScript ? (
                    <span className="flex flex-col gap-1">
                      Command:{" "}
                      <span className="text-xs bg-slate-100 rounded p-1 text-black">
                        {step.code}
                      </span>
                    </span>
                  ) : (
                    step.title
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 border-t border-gray-500">
        <label
          htmlFor="message"
          className="block mb-2 font-medium text-gray-900 dark:text-white"
        >
          Your message
        </label>
        <textarea
          id="message"
          onChange={(e) => setUserPrompt(e.target.value)}
          rows={4}
          className="mb-3 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
          placeholder="Add, improve, remove or anything..."
          value={userPrompt}
        ></textarea>
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <button
            type="button"
            onClick={handleSubmitUserPrompt}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-3 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Message
          </button>
        )}
      </div>
    </div>
  );
}
