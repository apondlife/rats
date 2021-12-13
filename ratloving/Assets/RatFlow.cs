using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RatFlow : MonoBehaviour
{
    public Transform container;
    public Generator generator;
    public Vector3 flow;
    public float noise;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        Bounds bounds = generator.localBounds;
        int i = 0;
        foreach (Transform rat in container) {
            float p = noise*(Mathf.PerlinNoise(Time.time, i*1000f)-0.5f)*2f;
            Vector3 pflow = flow + p*flow;
            rat.transform.localPosition = new Vector3 (
                RepeatBetween(rat.transform.localPosition.x + pflow.x*Time.deltaTime, bounds.min.x, bounds.max.x),
                RepeatBetween(rat.transform.localPosition.y + pflow.y*Time.deltaTime, bounds.min.y, bounds.max.y),
                RepeatBetween(rat.transform.localPosition.z + pflow.z*Time.deltaTime, bounds.min.z, bounds.max.z)
            );
            i++;
        }
    }

    static float RepeatBetween(float input, float min, float max) {
        return Mathf.Repeat(input - min, max - min) + min;
    }
}
