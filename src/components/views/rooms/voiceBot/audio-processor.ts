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
    // console.log(channel)
    //   if (input.length > 0) {
    //     const samples = input[0];
    //     let sum = 0;
    //     let rms = 0;
  
    //     // Calculated the squared-sum.
    //     for (let i = 0; i < samples.length; ++i)
    //       sum += samples[i] * samples[i];
  
    //     // Calculate the RMS level and update the volume.
    //     rms = Math.sqrt(sum / samples.length);
    //     this._volume = rms, this._volume * 0.8;
    //     // console.log('volume',this._volume)    
    // }


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
  