using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Video;

// Uses videoplayer as reference to drive animation
// Currently using legacy animation system because it seems better for this purpose. (even if its a bit weird)
// Should respect WrapMode automatically ? so pingpong should work fine.
public class SyncAnimationToVideo : MonoBehaviour
{
    public VideoPlayer video;
    //public Animation animation;
    //public string stateName;

    public AnimationClip clip;

    public float offset;
    
    // ignore the 'native' framerate of the animation, instead scale the animation to match the video exactly by this ratio (usually 1).
    // if 0 or negative, use native framerate.
    public float forceLengthRatio; 
    
    [Header("Debug")]
    public bool debugMode;
    public bool pause;
    [Range(0, 1200)]
    public long frame;
    public ulong nFrames;
    public double rTime; // read only

    //private AnimationState _state;

    // Start is called before the first frame update
    void Start()
    {
        //_state = animation[stateName];
    }

    // Update is called once per frame
    void Update()
    {
        if (!video.isPrepared) return;
        double videoTime;
        float time;

        if (debugMode) { // just for debug
            if (video.isPlaying && pause) video.Pause();
            if (!video.isPlaying && !pause) video.Play();

            video.frame = frame; // seek=
            videoTime = video.length * (frame / (float)video.frameCount);
        } else {
            videoTime = video.time;
        }
        
        nFrames = video.frameCount;
        rTime = videoTime;

        if (forceLengthRatio <= 0) {
            // play animation at its native framerate
            time = (float)videoTime + offset;
        } else {
            // Scale animation to forceLengthRatio*video.length
            // Debug.Log("videoTime: "+videoTime+" video.length: "+video.length);
            float t = (float)videoTime/(float)video.length;
            time = forceLengthRatio*t*clip.length + offset;
        }

        if (!float.IsNaN(time)) {
            clip.SampleAnimation(gameObject, time);
        }
    }
}
