using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using StarterAssets;

[RequireComponent(typeof(StarterAssetsInputs))]
public class RatController : MonoBehaviour
{
    private StarterAssetsInputs _inputs;
    public float speed = 1f;
    public float lerpFactor = 0.5f;

    private Quaternion _targetRot;
    // Start is called before the first frame update
    void Start()
    {
        _inputs = GetComponent<StarterAssetsInputs>();
    }

    // Update is called once per frame
    void Update()
    {
        Vector3 move = new Vector3(-_inputs.move.x, 0f, -_inputs.move.y);
        transform.position += move.normalized*speed*Time.deltaTime;

        if (move.magnitude > 0f) {
            _targetRot = Quaternion.LookRotation(move);
        }
        transform.rotation = Quaternion.Slerp(transform.rotation, _targetRot, 1f-Mathf.Pow(1f-lerpFactor, Time.deltaTime));
    }
}
