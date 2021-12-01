using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RandomOffset : MonoBehaviour
{
    public Animator animator;
    // Start is called before the first frame update
    void Start()
    {
        animator.SetFloat("Offset", Random.value);
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
