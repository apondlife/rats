using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RandomRotation : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        transform.rotation = Random.rotationUniform;
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
