from ultralytics import YOLO
import cv2
import wikipedia
import threading

# Load YOLO model (optionally use GPU with `.to("cuda")`)
model = YOLO("model.pt")
# model.to("cuda")  # Uncomment this if using GPU

# Lower resolution for speed
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

# Frame tracking
frame_count = 0
detect_every = 10

# For caching and threading
last_detected = ""
context_info = "Point at an object..."
context_cache = {}
context_lock = threading.Lock()

def fetch_context(label):
    global context_info
    try:
        summary = wikipedia.summary(label, sentences=2)
    except:
        summary = "No context found."
    with context_lock:
        context_cache[label] = summary
        context_info = summary

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    annotated_frame = frame.copy()

    # Detect every N frames
    if frame_count % detect_every == 0:
        results = model(frame)
        boxes = results[0].boxes
        annotated_frame = results[0].plot()

        if boxes and len(boxes.cls) > 0:
            class_id = int(boxes.cls[0].item())
            label = model.names[class_id]

            if label != last_detected:
                last_detected = label
                if label in context_cache:
                    context_info = context_cache[label]
                else:
                    context_info = "Fetching info..."
                    threading.Thread(target=fetch_context, args=(label,), daemon=True).start()
    else:
        # Use last frame as fallback
        cv2.putText(annotated_frame, "(Cached frame)", (20, 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (150, 150, 150), 1)

    # Display overlay with info
    cv2.rectangle(annotated_frame, (10, 10), (630, 100), (0, 0, 0), -1)
    cv2.putText(annotated_frame, f"Detected: {last_detected}", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
    cv2.putText(annotated_frame, f"Info: {context_info[:70]}...", (20, 80),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 255, 200), 1)

    cv2.imshow("Optimized Object Detection + Wikipedia Context", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
