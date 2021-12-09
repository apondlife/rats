using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Video;
using System.IO;

public class VideoManager : MonoBehaviour
{
	public VideoPlayer vp;
    public string videoName;

    private bool alreadyPlayed = false;
    // Start is called before the first frame update
    void Start()
    {
        vp = GetComponent<VideoPlayer>();
        vp.playOnAwake = false;
        vp.url = Path.Combine(Application.streamingAssetsPath, videoName);
        vp.Prepare();
    }

    // Update is called once per frame
    void Update()
    {
        if (!vp.isPlaying && !alreadyPlayed) {
            vp.Play();
            alreadyPlayed = true;
        }
    }

    // public void Play()
    // {
    // 	vp.Stop(); //frame = 0;
    // 	vp.Play();
    // }
}
