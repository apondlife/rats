using UnityEngine;

public static class Utils {
    // rmap [aIn, bIn] -> [aOut, bOut] using t
    public static float SuperLerp (float aIn, float bIn, float aOut, float bOut, float t) {
        return Mathf.Lerp(aOut, bOut, Mathf.InverseLerp (aIn, bIn, t));
    }

    public static Vector3 RandomPointInBounds(Bounds bounds) {
        return new Vector3(
            Random.Range(bounds.min.x, bounds.max.x),
            Random.Range(bounds.min.y, bounds.max.y),
            Random.Range(bounds.min.z, bounds.max.z)
        );
    }
}