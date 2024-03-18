import { useState, useRef } from "react";
import styled from "styled-components";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import { Pipeline, pipeline } from "@xenova/transformers";
import React from "react";

import { cn } from "../../../lib/utils";
import WaveformLoader from "../../ui/waveform-loader";
import RingLoader from "../../ui/ring-loader";

declare global {
    interface Navigator {
        msSaveBlob: (blob: Blob, fileName: string) => boolean;
    }
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}

const RecorderStyle = styled.div`
    @keyframes strobe {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
    .strobing {
        animation: strobe 1.6s infinite;
    }
`;
export const AudioCapture = ({ onCapture }: { onCapture: (transcription: string) => void }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoadingModel, setIsLoadingModel] = useState(false);
    const [isProcessingAudio, setIsProcessingAudio] = useState(false);
    const recorderRef = useRef<RecordRTC | null>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isEdge = navigator.userAgent.indexOf("Edge") !== -1 && !!navigator.msSaveBlob;
    const pipelineRef = useRef<Pipeline | null>(null);

    const loadPipeline = async () => {
        // let startTime = performance.now()
        setIsLoadingModel(true);
        pipelineRef.current = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en");
        setIsLoadingModel(false);
    };

    const startRecording = async () => {
        try {
            micStreamRef.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const options: RecordRTC.Options = getRecorderOptions();
            recorderRef.current = new RecordRTC(micStreamRef.current, options);
            recorderRef.current.startRecording();
            setIsRecording(true);
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
        if (recorderRef.current) {
            recorderRef.current.stopRecording(async () => {
                recorderRef.current && (await processRecording(URL.createObjectURL(recorderRef.current.getBlob())));
                if (micStreamRef.current) {
                    micStreamRef.current.getTracks().forEach((track) => track.stop());
                }
            });
        }
        setIsRecording(false);
    };

    const processRecording = async (blobUrl: string) => {
        setIsProcessingAudio(() => true);
        try {
            // Process the audio using the ASR pipeline
            if (pipelineRef.current) {
                // Process the audio using the ASR pipeline
                const transcriptionResult = await pipelineRef.current(blobUrl);
                if (!transcriptionResult.text) throw new Error("Failed to process microphone input. Please try again.");
                setIsProcessingAudio(() => false);
                onCapture(transcriptionResult.text);
            }
        } catch (error: any) {
            console.error("Error processing audio: ", error);
            setIsProcessingAudio(() => false);
        }
    };

    return (
        <RecorderStyle>
            {isLoadingModel || isProcessingAudio ? (
                <div className="flex flex-row items-center w-min gap-2">
                    {isLoadingModel && (
                        <>
                            <div className="text-[8px] max-w-[30px] text-center">Loading Speech Model</div>
                            <WaveformLoader />
                        </>
                    )}
                    {isProcessingAudio && <RingLoader />}
                </div>
            ) : (
                <div
                    className={cn(
                        "recorder  mx_MessageComposer_button mx_IconizedContextMenu_icon mx_MessageComposer_voiceMessage w-[26px] h-[26px]",
                        isRecording ? "!bg-[#5734d3] strobing" : "",
                    )}
                    onClick={pipelineRef.current ? (isRecording ? stopRecording : startRecording) : loadPipeline}
                />
            )}
        </RecorderStyle>
    );
};
