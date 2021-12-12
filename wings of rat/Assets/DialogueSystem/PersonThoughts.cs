using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

[RequireComponent(typeof(Collider))]
public class PersonThoughts : MonoBehaviour
{
    public GameObject _text;

    [TextArea]
    public string thought;

    private Camera _camera;

    // Start is called before the first frame update
    void Start()
    {
        _text.GetComponent<TMP_Text>().text = thought;

        _text.SetActive(false);

        _camera = Camera.main;
    }

    void OnTriggerEnter()
    {
        if (IsPointVisibleByCamera(transform.position, _camera)) {
            Debug.Log("trigger enter");
            _text.SetActive(true);

        }
    }

    void OnTriggerExit()
    {
        _text.SetActive(false);
    }

    static bool IsPointVisibleByCamera(Vector3 point, Camera c) {
        Vector3 vp = c.WorldToViewportPoint(point);
        return 0f <= vp.x && vp.x <= 1f && 0f <= vp.y && vp.y <= 1f && vp.z > 0f; 
    }
}
