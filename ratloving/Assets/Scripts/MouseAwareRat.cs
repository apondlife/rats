using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MouseAwareRat : MonoBehaviour
{
    public Camera camera;
    public Animator animator;

    public float maxAngle;
    public float radius;

    private Quaternion initRot;

    // Start is called before the first frame update
    void Start()
    {
        initRot = transform.localRotation;
    }

    // Update is called once per frame
    void Update()
    {
        Vector3 mouse = new Vector3(
            Input.mousePosition.x/Screen.width,
            Input.mousePosition.y/Screen.height,
            0f
        );
        Vector3 rat = camera.WorldToViewportPoint(transform.position);
        rat.z = 0f;

        float distance = Vector3.Distance(mouse, rat);

        // if (distance < 0.1f) {
        //     animator.Play("anim1");
        // } else {
        //     animator.Play("anim2");
        // }

        float x = distance/1.41f; // [-0.5, 0.5]
        float r = radius;

        float t = 1f - (x*x)/(r*r);
        t = Mathf.Clamp(t, 0f, 1f);
        

        transform.localRotation = initRot*Quaternion.AngleAxis(t*maxAngle, transform.forward);
        
        //animator.SetFloat("Speed", t);

        // animator.SetLayerWeight(1, t);
    }
}
