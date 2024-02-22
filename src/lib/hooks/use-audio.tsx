import { useEffect, useRef } from 'react'

import { audioStreamState, stopState, voiceBotState } from '../../components/views/rooms/voiceBot/VoiceBotButton'



/**
 * Hook containing functions to initialize and control audio playback.
 *
 * @return {Object} An object with a single method, `playbackAudio`, that
 *                  takes a base64 encoded audio data and adds it to the audio
 *                  queue for playback.
 */
export function useAudio() {
  const audioQueue = useRef<string[]>([])
  const isPlaying = useRef(false)
  const streamComplete = useRef(false)
  const updateStatus = voiceBotState(state => state.updateStatus)
  const stopDetected = stopState(state => state.stopDetected)
  const setStopDetected = stopState(state => state.setStopDetected)
  const source = useRef<AudioBufferSourceNode | null>(null)
  const audioContext: AudioContext = new (window.AudioContext ||
    window.webkitAudioContext)()
    const streamCompleted = audioStreamState(state => state.streamCompleted)
    // const setStreamCompleted = audioStreamState(state => state.setStreamCompleted)
    useEffect(() => {
      if(streamCompleted) {
        streamComplete.current = true
      }
    },[streamCompleted])
    useEffect(() => {
      if(stopDetected) {
        console.log(stopDetected)
        // audioQueue.current = ['stop']
        audioQueue.current = []
        source.current&&source.current.stop()
        source.current = null
        // addToAudioQueue('stop')
        
        
      }
    },[stopDetected])
  function addToAudioQueue(audioData: string): void {
    if (audioData!=='stop'){
      updateStatus('speak')
    }
    
    audioQueue.current.push(audioData)
    if (!isPlaying.current) {
      playNextAudioChunk()
    }
  }

  async function playNextAudioChunk(): Promise<void> {
    // console.log(audioQueue)
    if (audioQueue.current.length === 0) {
    //   if(streamComplete.current) {
    //         console.log('stream completed, setting status to inactive')
    //         // updateStatus('inactive')
    //         // setStreamCompleted(false)
    //         streamComplete.current=false
    //       }
      isPlaying.current = false
      return
    }
    isPlaying.current = true
    const audioData: string = audioQueue.current.shift() as string
    // Decode the base64 audio data
    if (audioData&&audioData!=='stop'){
    const audioBuffer: AudioBuffer = await decodeAudioData(audioData)

    source.current= audioContext.createBufferSource()
    source.current.buffer = audioBuffer
    source.current.connect(audioContext.destination)
    source.current.start(0)

    source.current.onended = (): void => {
      playNextAudioChunk()
    }
  }
  else if (audioData==='stop'){
      console.log(audioData)
          console.log('stream completed, setting status to inactive')
          updateStatus('inactive')
          // setStreamCompleted(false)
          // streamComplete.current=false
          isPlaying.current = false
          audioQueue.current=[]
          return
  }
}

  async function decodeAudioData(base64Data: string): Promise<AudioBuffer> {
    const audioData: ArrayBuffer = base64ToBuffer(base64Data)
    return await audioContext.decodeAudioData(audioData)
  }

  function base64ToBuffer(base64: string): ArrayBuffer {
    const binaryString: string = window.atob(base64)
    const len: number = binaryString.length
    const bytes: Uint8Array = new Uint8Array(len)
    for (let i: number = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  return {
    playbackAudio: addToAudioQueue
  }
}
