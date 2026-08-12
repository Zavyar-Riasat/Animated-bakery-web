import os
import cv2

def extract_frames(video_path, output_dir):
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Open the video file
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video file {video_path}")
        return

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Opened {video_path}. Total frames according to metadata: {total_frames}")

    frame_count = 0
    saved_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Save frame sequentially as JPG image
        frame_filename = os.path.join(output_dir, f"frame_{frame_count:04d}.jpg")
        success = cv2.imwrite(frame_filename, frame)
        if success:
            saved_count += 1
        frame_count += 1

    cap.release()
    print(f"Extraction complete! Successfully saved {saved_count} frames to '{output_dir}'.")

if __name__ == "__main__":
    video_file = "video.mp4"
    output_folder = "output_frames"
    extract_frames(video_file, output_folder)
