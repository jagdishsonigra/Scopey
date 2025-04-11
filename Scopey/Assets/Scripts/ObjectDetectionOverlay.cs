using System.Collections.Generic;
using System.Net.Sockets;
using System.Net;
using System.Threading;
using UnityEngine;

public class ObjectDetectionOverlay : MonoBehaviour
{
    public Camera passthroughCamera;
    public GameObject boxPrefab;
    public string serverIP = "192.168.1.12";
    public int serverPort = 5005;

    private Thread clientThread;
    private TcpClient client;
    private NetworkStream stream;
    private List<GameObject> activeBoxes = new List<GameObject>();
    private List<Rect> receivedBoxes = new List<Rect>();

    void Start()
    {
        clientThread = new Thread(ClientLoop);
        clientThread.IsBackground = true;
        clientThread.Start();
    }

    void Update()
    {
        lock (receivedBoxes)
        {
            foreach (var box in activeBoxes)
                Destroy(box);
            activeBoxes.Clear();

            foreach (var rect in receivedBoxes)
            {
                Vector3 screenCenter = new Vector3(rect.x + rect.width / 2, rect.y + rect.height / 2, 2f); // 2m depth
                Vector3 worldPos = passthroughCamera.ScreenToWorldPoint(screenCenter);

                Vector3 boxSize = new Vector3(rect.width / 500f, rect.height / 500f, 0.01f); // Size scale
                GameObject box = Instantiate(boxPrefab, worldPos, Quaternion.identity);
                box.transform.LookAt(passthroughCamera.transform); // Optional: face user
                box.transform.localScale = boxSize;

                activeBoxes.Add(box);
            }

            receivedBoxes.Clear();
        }
    }

    void OnApplicationQuit()
    {
        client?.Close();
        clientThread?.Abort();
    }

    void ClientLoop()
    {
        client = new TcpClient(serverIP, serverPort);
        stream = client.GetStream();

        while (true)
        {
            byte[] buffer = new byte[4 * 4]; // 4 floats
            int read = 0;

            while (read < buffer.Length)
            {
                int bytes = stream.Read(buffer, read, buffer.Length - read);
                if (bytes == 0) return;
                read += bytes;
            }

            float x = System.BitConverter.ToSingle(buffer, 0);
            float y = System.BitConverter.ToSingle(buffer, 4);
            float w = System.BitConverter.ToSingle(buffer, 8);
            float h = System.BitConverter.ToSingle(buffer, 12);

            lock (receivedBoxes)
            {
                receivedBoxes.Add(new Rect(x, y, w, h));
            }
        }
    }
}
