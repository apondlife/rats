using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SetTimescale : MonoBehaviour
{
    public float timeScale = 1f;
    public float fixedTimestepRelative = 0.02f;
    // Start is called before the first frame update
    void Start()
    {
    }

    // Update is called once per frame
    void Update()
    {
        Time.timeScale = timeScale;
        Time.fixedDeltaTime = fixedTimestepRelative * timeScale;
    }
}
