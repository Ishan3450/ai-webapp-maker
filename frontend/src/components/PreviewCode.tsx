import { WebContainer, WebContainerProcess } from '@webcontainer/api'
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

interface PrevieCodeProps {
    webContainer: WebContainer | null;
    setMountAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewCode = ({ webContainer, setMountAgain }: PrevieCodeProps) => {
    const [url, setUrl] = useState<string>("");
    const [containerLogs, setContainerLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    async function initWebcontainerPreviewFrame() {
        try {
            // Install dependencies
            const installProcess = await webContainer?.spawn('npm', ['install']);
            if (installProcess) {
                installProcess.output.pipeTo(
                    new WritableStream({
                        write(data) {
                            console.log(data);
                            setContainerLogs((prev: string[]) => [String(data).trim(), ...prev]);
                        },
                    })
                );

                // Run development server
                const devProcess = await webContainer?.spawn('npm', ['run', 'dev']);
                if (!devProcess) {
                    console.error("Failed to start the dev process in webcontainer.");
                    setContainerLogs((prev) => ["Webcontainer Error: Dev process could not be started.", ...prev]);
                }
            } else {
                console.error("Failed to start the install process in webcontainer.");
                setContainerLogs((prev) => ["Webcontainer Error: Install process could not be started.", ...prev]);
            }
        } catch (error) {
            console.error("Error during WebContainer initialization:", error);
            setContainerLogs((prev) => [`Error: ${error}`, ...prev]);
        }
    }

    async function handleCommands() {
        try {
            setLoading(true);
            setMountAgain(prev => !prev);
            const installProcess = await webContainer?.spawn('npm', ['install']);

            installProcess?.output.pipeTo(new WritableStream({
                write(data) {
                    console.log(data);
                    setContainerLogs((prev: string[]) => [data, ...prev]);
                }
            }));

            await webContainer?.spawn('npm', ['run', 'dev']);
        } catch (error) {
            console.error("Error during running commands:", error);
            setContainerLogs((prev: string[]) => [`Error: ${error}`, ...prev]);
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 50000));
            setLoading(false);
        }
    }

    async function handleLoadingWebcontainerPreview() {
        try {
            setLoading(true);
            setMountAgain(prev => !prev);
            await webContainer?.spawn('npm', ['run', 'dev']);
        } catch (error) {
            console.error("Error during running commands:", error);
            setContainerLogs((prev: string[]) => [`Error: ${error}`, ...prev]);
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 50000));
            setLoading(false);
        }
    }

    useEffect(() => {
        initWebcontainerPreviewFrame();

        // Register WebContainer events
        webContainer?.on("server-ready", (port, url) => {
            console.log(`Server ready at port: ${port}, URL: ${url}`);
            setUrl(url);
        });

        webContainer?.on("error", (err) => {
            console.error("Error in the WebContainer:", err);
            setContainerLogs((prev) => [`Error: ${err.message}`, ...prev]);
        });
    }, []);


    return (
        <div className='h-full w-full'>
            {!url ? (<div className='h-full w-full flex items-center justify-center flex-col'>
                <div className='text-gray-400'>Preview will be shown here </div>
                <div className='text-gray-400'>Wait for some time, container is loading...</div>
                <div className="bg-black text-lime-500 font-mono p-4 rounded overflow-y-auto h-64 w-96 text-xs border border-gray-700">
                    {containerLogs.map((log, index) => (
                        <div key={index} className="mb-2">{log}</div>
                    ))}
                </div>
                <div className='text-gray-400 my-3 text-center mx-5'>If after logs in terminal stopped still the preview is not opened then first click the Run Command and Preview buttons and/or swith the code and preview tab</div>
                {
                    loading ? <Loader2 className='animate-spin' /> :
                        <span className='flex gap-2'>
                            <button onClick={handleCommands} className='bg-gray-700 px-5 py-2 rounded hover:bg-gray-900 duration-200'>Run Commands</button>
                            <button onClick={handleLoadingWebcontainerPreview} className='bg-gray-700 px-5 py-2 rounded hover:bg-gray-900 duration-200'>Run Preview</button>
                        </span>
                }
            </div>) : <iframe src={url} className='h-full w-full' />}

        </div>
    )
}

export default PreviewCode