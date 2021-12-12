using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FlapWing : MonoBehaviour
{
    public float flapAmplitude = 30f; // radians
    public float flapFrequency = 10f; // hertz
    public float phaseShift;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        transform.localEulerAngles = new Vector3(
            0f,
            0f,
            flapAmplitude*Mathf.Sin(Time.time*flapFrequency + phaseShift)
        );
    }
}
