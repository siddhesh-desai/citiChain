import React, { useRef } from "react";
import Webcam from "react-webcam";

export default function TestWebcam() {
  const webcamRef = useRef(null);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#222",
      }}
    >
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        videoConstraints={{ facingMode: "user" }}
        style={{ borderRadius: 8 }}
      />
    </div>
  );
}
