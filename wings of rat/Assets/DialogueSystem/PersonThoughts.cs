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

    // Start is called before the first frame update
    void Start()
    {
        _text.GetComponent<TMP_Text>().text = thought;

        _text.SetActive(false);
    }

    void OnTriggerEnter()
    {
        Debug.Log("trigger enter");
        _text.SetActive(true);
    }

    void OnTriggerExit()
    {
        _text.SetActive(false);
    }
}
