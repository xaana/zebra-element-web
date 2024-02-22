import { useState, useRef, useEffect, useMemo } from "react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import { Pipeline, pipeline } from "@xenova/transformers";
import * as tf from "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";
import styled from "styled-components";
import { create } from "zustand";
import React from "react";

import { Dialog, DialogContent, DialogTrigger } from "../../../ui/dialog";
import type { SpeechCommandRecognizer } from "@tensorflow-models/speech-commands";
import type { SpeechCommandRecognizerResult } from "@tensorflow-models/speech-commands";
import { IconHeadphones } from "../../../ui/icons";
import { Visualizer } from "./visualizer";
import { LoadingAnimation } from "./loading-animation";
import { FadeTransition } from "../../../ui/transitions/fade-transition";
import { SwitchFadeTransition } from "../../../ui/transitions/switch-fade-transition";
import { cn } from "../../../../lib/utils";
import { useAudio } from "../../../../lib/hooks/use-audio";

const DialogStyle = styled.div`
    .blob__dialog {
        background: rgb(255, 255, 255);
        background: -moz-linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(233, 233, 233, 1) 80%);
        background: -webkit-linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(233, 233, 233, 1) 80%);
        background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(233, 233, 233, 1) 80%);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffffff",endColorstr="#e9e9e9",GradientType=1);
    }
    .blob__dialog > button {
        color: black;
    }
    #wrap canvas {
        width: 100% !important;
        height: 100% !important;
        display: block;
    }
`;

declare global {
    interface Navigator {
        msSaveBlob: (blob: Blob, fileName: string) => boolean;
    }
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}
type AudioStreamState = {
    streamCompleted: boolean;
};

type AudioStreamAction = {
    setStreamCompleted: (streamComplete: AudioStreamState["streamCompleted"]) => void;
};

export const audioStreamState = create<AudioStreamState & AudioStreamAction>((set) => ({
    streamCompleted: false,
    setStreamCompleted: (streamComplete: boolean) => set(() => ({ streamCompleted: streamComplete })),
}));

type StopState = {
    stopDetected: boolean;
};

type StopAction = {
    setStopDetected: (stopDetected: StopState["stopDetected"]) => void;
};

export const stopState = create<StopState & StopAction>((set) => ({
    stopDetected: false,
    setStopDetected: (stopDetected: boolean) => set(() => ({ stopDetected: stopDetected })),
}));

type State = {
    status: string;
    voiceBotEnabled: boolean;
};

type Action = {
    updateStatus: (newStatus: State["status"]) => void;
    setVoiceBotEnabled: (newDialogOpen: State["voiceBotEnabled"]) => void;
};

export const voiceBotState = create<State & Action>((set) => ({
    status: "loading",
    voiceBotEnabled: false,
    updateStatus: (newStatus: string) => {
        set(() => ({ status: newStatus }));
    },
    setVoiceBotEnabled: (newDialogOpen: boolean) => set(() => ({ voiceBotEnabled: newDialogOpen })),
}));

const workletCode = `
export default class MyAudioWorkletProcessor extends AudioWorkletProcessor {
    public average: number = 0;
    public count: number = 0;
    public silenceThreshold: number = 2;
    public silenceCountThreshold: number = 3;
    // sampleRate: number = 44100;
    public currentFrame:number = 0
    public _volume:number =0
  
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public process(inputs: Float32Array[][]) {
      const input = inputs[0];
      const channel = input[0];

      this.currentFrame+=1
      if (this.currentFrame % 200 === 0) {
        let sum = 0;
        for (let i = 0; i < channel.length; i++) {
          sum += Math.abs(channel[i]);
        }
        // console.log(sum)
        this.average = sum *1000/ channel.length;
        if (this.average<this.silenceThreshold){
            this.count+=1
        }
        else{
            this.count=0
        }
        
      }
      console.log(this.average)
      if (this.count > this.silenceCountThreshold) {
        this.port.postMessage('silence-detected');
        return false; // Stop processing audio when silence is detected
      }
  
      return true;
    }
  
  }
  
  registerProcessor('my-audio-worklet-processor', MyAudioWorkletProcessor);
  
`;

export const VoiceBotButton = () => {
    const status = voiceBotState((state) => state.status);
    const updateStatus = voiceBotState((state) => state.updateStatus);
    const voiceBotEnabled = voiceBotState((state) => state.voiceBotEnabled);
    const setVoiceBotEnabled = voiceBotState((state) => state.setVoiceBotEnabled);
    const streamCompleted = audioStreamState((state) => state.streamCompleted);
    const setStreamCompleted = audioStreamState((state) => state.setStreamCompleted);
    const setStopDetected = stopState((state) => state.setStopDetected);
    const stopDetected = stopState((state) => state.stopDetected);
    const loaderRef = useRef<HTMLDivElement>(null);

    const statusMap: Record<string, string> = {
        loading: "Loading Speech Models...",
        inactive: "Ready",
        speak: "Speaking...",
        listen: "Listening...",
        compute: "Generating Response...",
    };

    const [triggered, setTriggered] = useState(false);
    const recorderRef = useRef<RecordRTC | null>(null);
    const mic = useRef<MediaStream>();
    // const scriptProcessor = useRef<ScriptProcessorNode>()
    const recognizerRef = useRef<SpeechCommandRecognizer | null>(null);
    const streamComplete = useRef(false);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isEdge = navigator.userAgent.indexOf("Edge") !== -1 && !!navigator.msSaveBlob;
    const pipelineRef = useRef<Pipeline | null>(null);
    const statusRef = useRef(null);

    const loadPipeline = async () => {
        // Disable local models for embedded mode
        if (!voiceBotEnabled) {
            return;
        }
        // if (VITE_DEPLOY_MODE === 'embed') {
        //   env.allowLocalModels = false
        // }
        if (!pipelineRef.current && voiceBotEnabled) {
            pipelineRef.current = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en");
            updateStatus("inactive");
        }

        // startListeningForActivationPhrase('zebra')
    };
    useEffect(() => {
        if (streamCompleted) {
            streamComplete.current = true;
        }
    }, [streamCompleted]);
    useEffect(() => {
        if (triggered) {
            // stopListeningForActivationPhrase()
            // recognizerRef.current = null
            // setTriggered(false)
            startRecording();
        } else {
            if (voiceBotEnabled) {
                console.log("load speech model");
                loadSpeechModel();
                updateStatus("inactive");
            }
        }
    }, [triggered]);

    useEffect(() => {
        if (triggered && streamComplete.current && status === "inactive") {
            setStopDetected(false);
            streamComplete.current = false;
            setStreamCompleted(false);
            setTriggered(false);
        }
    }, [streamComplete.current, status]);

    useEffect(() => {
        if (voiceBotEnabled) {
            // stopListeningForActivationPhrase()
            updateStatus("loading");
            loadSpeechModel();
            setStopDetected(!voiceBotEnabled);
        } else {
            stopListeningForActivationPhrase();
            onStop && onStop();
            recognizerRef.current = null;
            pipelineRef.current = null;
            setStopDetected(!voiceBotEnabled);
            setTriggered(voiceBotEnabled);
            // fetch(`${API_ENDPOINT}/api/web/stop_audio`, {
            //   method: 'GET',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            // });
        }
    }, [voiceBotEnabled]);

    const loadSpeechModel = async () => {
        stopListeningForActivationPhrase();
        // recognizerRef.current = null
        setStopDetected(false);
        // tf.setBackend('cpu').then(async () => {
        //   // Initialize or load your model here
        //   try {
        //     const recognizer = speechCommands.create(
        //       'BROWSER_FFT',
        //       undefined,
        //       `${
        //         VITE_DEPLOY_MODE === 'embed'
        //           ? 'https://zebra.algoreus.net'
        //           : VITE_PUBLIC_BASE_URL
        //       }/models/speech-commands/model.json`, // URL to the custom model's model.json
        //       `${
        //         VITE_DEPLOY_MODE === 'embed'
        //           ? 'https://zebra.algoreus.net'
        //           : VITE_PUBLIC_BASE_URL
        //       }/models/speech-commands/metadata.json` // URL to the custom model's metadata.json
        //     )
        //     await recognizer.ensureModelLoaded()
        //     recognizerRef.current = recognizer
        //   } catch (error) {
        //     console.error('Error loading speech model:', error)
        //   } finally {
        //     if(voiceBotEnabled) await loadPipeline()
        //     startListeningForActivationPhrase()
        //   }
        // })
        tf.setBackend("cpu").then(async () => {
            // Initialize or load your model here
            try {
                const recognizer = speechCommands.create(
                    "BROWSER_FFT",
                    undefined,
                    `http://localhost:5500/model.json`, // URL to the custom model's model.json
                    `http://localhost:5500/metadata.json`, // URL to the custom model's metadata.json
                );
                await recognizer.ensureModelLoaded();
                recognizerRef.current = recognizer;
            } catch (error) {
                console.error("Error loading speech model:", error);
            } finally {
                if (voiceBotEnabled) await loadPipeline();
                startListeningForActivationPhrase();
            }
        });
    };

    const onCapture = async (text: string) => {
        const res: Response = await fetch(`http://localhost:8000/api/web/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                //   session_id: sessionId.current,
                query: text,
                // audio: true,
                audio: true,
                //   previous_messages: messages.map(message => {
                //     return {
                //       role: message.role,
                //       content: message.content
                //     }
                //   })
            }),
            signal: abortController.current?.signal,
        });
        if (!res.body) {
            throw new Error("No ReadableStream received");
        }
        const contentType = res.headers.get("Content-Type");
        const reader: ReadableStreamDefaultReader = res.body.getReader();
        if (contentType === "text/event-stream; charset=utf-8") {
            reader && console.log(reader);
        } else if (contentType === "application/json") {
            reader && processJsonStream(reader);
        }
    };
    let responseBuffer = "";
    const decoder = useMemo(() => new TextDecoder(), []);
    const { playbackAudio } = useAudio();
    const stop = useRef(false);
    const abortController = useRef<AbortController | null>(new AbortController());

    const blob = new Blob([workletCode], { type: "application/javascript" });
    const workletURL = URL.createObjectURL(blob);

    const onStop = () => {
        abortController.current?.abort();
        // setIsLoading(false)
        abortController.current = new AbortController();
    };
    useEffect(() => {
        if (stopDetected) {
            stop.current = stopDetected;
        } else {
            stop.current = stopDetected;
        }
    }, [stopDetected]);
    const processJsonStream = async (reader: ReadableStreamDefaultReader<any>, onComplete?: Function) => {
        let partialChunk: string = "";
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                if (partialChunk.trim()) {
                    try {
                        const parsedChunk: { type: string; data: string } = JSON.parse(partialChunk);
                        if (parsedChunk.type === "audio") {
                            //   console.log('stopDetected', stop.current)
                            if (!stop.current) {
                                playbackAudio(parsedChunk.data);
                            }
                        } else if (parsedChunk.type === "text") {
                            responseBuffer += parsedChunk.data;
                            onComplete && (await onComplete(responseBuffer));
                        } else if (parsedChunk.type === "json") {
                            onComplete && (await onComplete(parsedChunk.data));
                        }
                    } catch (e) {
                        console.error("Error parsing final JSON chunk", e);
                    }
                }
                setStreamCompleted(true);
                if (!stop.current) {
                    playbackAudio("stop");
                }

                break;
            }
            partialChunk += decoder.decode(value, { stream: true });
            let boundaryIndex: number;
            while ((boundaryIndex = partialChunk.indexOf("}{")) !== -1) {
                const jsonChunk: string = partialChunk.substring(0, boundaryIndex + 1);
                partialChunk = partialChunk.substring(boundaryIndex + 1);
                try {
                    const parsedChunk: { type: string; data: string } = JSON.parse(jsonChunk);
                    if (parsedChunk.type === "audio") {
                        // console.log('stopDetected', stop.current)
                        if (!stop.current) {
                            playbackAudio(parsedChunk.data);
                        }
                    } else if (parsedChunk.type === "text") {
                        responseBuffer += parsedChunk.data;
                    }
                } catch (e) {
                    console.error("Error parsing JSON chunk", e);
                }
            }
        }
    };

    const startListeningForActivationPhrase = () => {
        const recognizer = recognizerRef.current;
        const probabilityThreshold = 0.95;
        if (recognizer) {
            recognizer.listen(
                async (result: SpeechCommandRecognizerResult) => {
                    const scores: Float32Array | Float32Array[] = result.scores;
                    const words = recognizer.wordLabels();

                    if (scores instanceof Float32Array) {
                        let maxScoreIndex = 0;
                        let maxScore = 0;

                        scores.forEach((score, index) => {
                            if (score > maxScore) {
                                maxScore = score;
                                maxScoreIndex = index;
                            }
                        });

                        const highestScoringWord = words[maxScoreIndex];
                        console.log("Highest scoring word:", highestScoringWord, "with score:", maxScore);
                        console.log("trigger", triggered);
                        if (highestScoringWord.toLowerCase() === "zebra") {
                            console.log("zebra detected");
                            if (triggered) {
                                setTriggered(false);
                                setStopDetected(true);
                                console.log(onStop);
                                onStop && onStop();
                                stopListeningForActivationPhrase();
                            } else {
                                setTriggered(true);
                                stopListeningForActivationPhrase();
                            }
                        }
                    }
                },
                {
                    probabilityThreshold: probabilityThreshold,
                    invokeCallbackOnNoiseAndUnknown: true,
                    overlapFactor: 0.4,
                    suppressionTimeMillis: 200,
                    audioTrackConstraints: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100,
                    },
                },
            );
        }
    };

    const stopListeningForActivationPhrase = () => {
        if (recognizerRef.current?.isListening()) {
            console.log("stop listening");
            recognizerRef.current.stopListening();
            recognizerRef.current = null;
        }
    };

    const startRecording = async () => {
        try {
            updateStatus("listen");
            console.log("start recording to transcription");
            mic.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const audioContext = new AudioContext();
            audioContext.audioWorklet
                .addModule(workletURL)
                .then(() => {
                    console.log("silence detecter started");
                    const microphone = mic.current && audioContext.createMediaStreamSource(mic.current);
                    const workletNode = new AudioWorkletNode(audioContext, "my-audio-worklet-processor");

                    microphone && microphone.connect(workletNode).connect(audioContext.destination);

                    workletNode.port.postMessage("start");
                    workletNode.port.onmessage = (event) => {
                        if (event.data === "silence-detected") {
                            console.log("Silence detected, stop recording...");
                            stopRecording();
                        }
                    };
                })
                .catch((error) => {
                    console.error("Error loading audio worklet:", error);
                });
            const options: RecordRTC.Options = getRecorderOptions();
            recorderRef.current = new RecordRTC(mic.current, options);
            recorderRef.current.startRecording();
        } catch (error: any) {
            console.error("Error accessing the microphone: ", error);
        }
    };

    const getRecorderOptions = () => {
        const options: RecordRTC.Options = {
            type: "audio",
            numberOfAudioChannels: isEdge ? 1 : 2,
            checkForInactiveTracks: true,
            bufferSize: 16384,
        };

        if (isSafari || isEdge) {
            options.recorderType = StereoAudioRecorder;
        }

        if (navigator.platform && navigator.platform.toLowerCase().indexOf("win") === -1) {
            options.sampleRate = 48000;
        }

        if (isSafari) {
            options.sampleRate = 44100;
            options.bufferSize = 4096;
            options.numberOfAudioChannels = 2;
        }

        return options;
    };
    const stopRecording = () => {
        mic.current && mic.current.getTracks().forEach((track) => track.stop());

        if (recorderRef.current) {
            recorderRef.current.stopRecording(async () => {
                updateStatus("compute");
                recorderRef.current && (await processRecording(URL.createObjectURL(recorderRef.current.getBlob())));
            });
        }
        // setTriggered(false)
        if (voiceBotEnabled && pipelineRef.current) {
            console.log("loadSpeechModel and update the status to inactive");
            loadSpeechModel();
        }
    };

    const processRecording = async (blobUrl: string) => {
        try {
            // Process the audio using the ASR pipeline
            if (pipelineRef.current) {
                // Process the audio using the ASR pipeline
                const transcriptionResult = await pipelineRef.current(blobUrl);
                if (!transcriptionResult.text) throw new Error("Failed to process microphone input. Please try again.");
                console.log(transcriptionResult.text);
                await onCapture(transcriptionResult.text);
            }
        } catch (error: any) {
            console.error("Error processing audio: ", error);
        }
    };
    return (
        <div>
            <Dialog
                open={voiceBotEnabled}
                onOpenChange={(open: boolean) => {
                    setVoiceBotEnabled(open);
                    !open && updateStatus("loading");
                }}
            >
                <DialogTrigger className="zexa-border-0 zexa-bg-transparent">
                    <div
                        className={cn(
                            "!zexa-rounded-full zexa-bg-transparent zexa-shadow-none zexa-border-0 zexa-cursor-pointer",
                        )}
                    >
                        <IconHeadphones className={cn("zexa-h-6 zexa-w-6")} />
                    </div>
                </DialogTrigger>
                <DialogStyle>
                    <DialogContent
                        className="zexa-w-[90vw] sm:zexa-w-[50vw] sm:zexa-max-w-[400px] zexa-h-[400px] !zexa-p-0 zexa-bg-white dark:zexa-bg-black zexa-overflow-hidden"
                        style={{ transform: "translate(-50%, -50%)" }}
                    >
                        <FadeTransition
                            in={status === "loading"}
                            nodeRef={loaderRef}
                            duration={300}
                            className="zexa-z-[2] zexa-h-full zexa-w-full zexa-absolute zexa-top-0 zexa-left-0"
                        >
                            <div className="zexa-h-full zexa-w-full zexa-bg-white dark:zexa-bg-black" ref={loaderRef}>
                                <LoadingAnimation />
                            </div>
                        </FadeTransition>
                        <Visualizer status={status} />
                        <div className="zexa-absolute zexa-bottom-0 zexa-left-0 zexa-mb-8 zexa-w-full zexa-z-[3]">
                            <SwitchFadeTransition switcher={statusMap[status]} nodeRef={statusRef}>
                                <p
                                    ref={statusRef}
                                    className="animated-text zexa-text-center zexa-text-sm zexa-uppercase zexa-tracking-widest"
                                >
                                    {statusMap[status]}
                                </p>
                            </SwitchFadeTransition>
                            {/* <div className=" zexa-flex zexa-gap-1 zexa-items-center">
                <button onClick={() => updateStatus('loading')}>loading</button>
                <button onClick={() => updateStatus('inactive')}>
                  inactive
                </button>
                <button onClick={() => updateStatus('listen')}>listen</button>
                <button onClick={() => updateStatus('compute')}>compute</button>
                <button onClick={() => updateStatus('speak')}>speak</button>
              </div> */}
                        </div>
                    </DialogContent>
                </DialogStyle>
            </Dialog>
        </div>
    );
};
