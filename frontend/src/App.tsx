import React, { useEffect, useState } from 'react';
import { PromptInput } from './components/PromptInput';
import { MainInterface } from './pages/MainInterface';

function App() {
  const [hasSubmittedPrompt, setHasSubmittedPrompt] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");

  const handlePromptSubmit = (p: string) => {
    setPrompt(p);
    setHasSubmittedPrompt(true);
  };

  return (
    <div className="h-full">
      {!hasSubmittedPrompt ? (
        <PromptInput onSubmit={handlePromptSubmit} />
      ) : (
        <MainInterface prompt={prompt} />
      )}
    </div>
  );
}

export default App;