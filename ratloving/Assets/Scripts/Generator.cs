using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using System.Linq;
#if UNITY_EDITOR
using UnityEditor.SceneManagement;
#endif
[ExecuteInEditMode]
public class Generator : MonoBehaviour
{
    public Bounds worldBounds;
    public GameObject[] prefabs;

    public bool randomizeTexture;

    public float minScale;
    public float maxScale;

    public Vector3 minRotation;
    public Vector3 maxRotation;

    public int nObjects = 50;

    private string[] _materialIds;
    private string[] _textureIds;

    public bool generateOnAwake;

#if UNITY_EDITOR
    public void Awake() {
        if (generateOnAwake) Generate();
    }
// (needed because AssetDatabase won't compile outside of editor) 
    public void Generate() {
        Debug.Log("Generate");

        _materialIds = _textureIds = null;
        Debug.Log("Generating game...");

        string containerName = "Generated";
        GameObject container = GameObject.Find(containerName);
        if (container) {
            DestroyImmediate(container, false);
        }

        container = new GameObject(containerName);
        container.transform.SetParent(this.transform);

        for (int i = 0; i < nObjects; i++) {
            GameObject prefab = prefabs[Random.Range(0, prefabs.Length)];
            GameObject obj = Instantiate(prefab, container.transform);
            obj.transform.eulerAngles = new Vector3(Random.Range(minRotation.x, maxRotation.x), Random.Range(minRotation.y, maxRotation.y), Random.Range(minRotation.z, maxRotation.z));

            obj.transform.position = Vector3.zero;
            obj.transform.localScale = Vector3.one;

            Vector3 totalBoundsMin = Vector3.positiveInfinity;
            Vector3 totalBoundsMax = Vector3.negativeInfinity;

            obj.GetComponentsInChildren<Renderer>().All((Renderer r) => {
                if (randomizeTexture) {
                    r.sharedMaterial = new Material(r.sharedMaterial); //RandomMaterial();
                    r.sharedMaterial.mainTexture = RandomTexture();
                }

                totalBoundsMin = Vector3.Min(totalBoundsMin, r.bounds.min);
                totalBoundsMax = Vector3.Max(totalBoundsMax, r.bounds.max);

                return true;
            });

            Bounds totalBounds = new Bounds();
            totalBounds.min = totalBoundsMin;
            totalBounds.max = totalBoundsMax;

            float _maxDimension = Mathf.Max(new[] {totalBounds.size.x, totalBounds.size.y, totalBounds.size.z});


            float scaleFactor = Random.Range(minScale, maxScale);
            obj.transform.localScale *= (scaleFactor/_maxDimension); 
            obj.transform.position = Utils.RandomPointInBounds(worldBounds);// - totalBounds.center;
        }
    }

    private Material RandomMaterial() {
        if (_materialIds == null) {
            _materialIds = AssetDatabase.FindAssets("t:material", null);
        }
        string id = _materialIds[Random.Range(0, _materialIds.Length)];
        Material m = (Material)AssetDatabase.LoadAssetAtPath(AssetDatabase.GUIDToAssetPath(id), typeof(Material));
        return m;
    }

    private Texture RandomTexture() {
        if (_textureIds == null) {
            _textureIds = AssetDatabase.FindAssets("t:texture2D", null);
        }
        string tid = _textureIds[Random.Range(0, _textureIds.Length)];
        Texture2D t = (Texture2D)AssetDatabase.LoadAssetAtPath(AssetDatabase.GUIDToAssetPath(tid), typeof(Texture2D));
        return t;
    }
#endif
}
