using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CreatePeopleThoughts : MonoBehaviour
{
    public TextAsset dialogue;
    public Transform[] people;
    public GameObject personThoughtPrefab;

    // Start is called before the first frame update
    void Start()
    {
        int i = 0;
        foreach (string line in dialogue.text.Split('\n')) {
            GameObject obj = Instantiate(personThoughtPrefab, people[i]);
            obj.GetComponent<PersonThoughts>().thought = line;
            i++;
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
