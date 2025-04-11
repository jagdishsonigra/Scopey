from ultralytics import YOLO
import torch

torch.set_num_threads(4)

model = YOLO("yolo11n.pt")

model.train(
    data=r"\yolo_dataset\data.yaml",
    epochs=15,
    batch=16,
    imgsz=640,
    device="cpu",
    workers=8,
    cache=False
)

print("✅ Training complete!")
