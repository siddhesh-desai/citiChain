import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const JITSI_DOMAIN = "meet.jit.si";
const ROOM_NAME = "KYC_DemoCall_Room_123";

const kycSteps = [
  "Documents Uploaded",
  "Documents Verified",
  "Form Filled",
  "Form Verified",
  "Live Photo Taken",
  "Live Photo Verified",
];

// Generate Indian time slots (9 AM to 6 PM, every 30 minutes)
const indianTimeSlots = [];
for (let h = 9; h <= 18; h++) {
  indianTimeSlots.push(`${h.toString().padStart(2, "0")}:00`);
  if (h !== 18) indianTimeSlots.push(`${h.toString().padStart(2, "0")}:30`);
}

export default function KycDashboard() {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState(kycSteps.length); // all done by default
  const [demoCallOpen, setDemoCallOpen] = useState(false);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState(null);

  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [passportGenerated, setPassportGenerated] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  const jitsiContainerRef = useRef(null);

  // Animate line progress (simulate step-by-step highlight)
  const [animatedStep, setAnimatedStep] = useState(0);
  useEffect(() => {
    if (animatedStep < completedSteps) {
      const timer = setTimeout(() => setAnimatedStep(animatedStep + 1), 400);
      return () => clearTimeout(timer);
    }
  }, [animatedStep, completedSteps]);

  // Load Jitsi Meet API when demoCallOpen true
  useEffect(() => {
    if (!demoCallOpen) {
      if (jitsiApi) {
        jitsiApi.executeCommand("hangup");
        setJitsiApi(null);
      }
      return;
    }
    const domain = JITSI_DOMAIN;
    const options = {
      roomName: ROOM_NAME,
      parentNode: jitsiContainerRef.current,
      width: "100%",
      height: 400,
      configOverwrite: {
        disableInviteFunctions: true,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "hangup",
          "chat",
          "raisehand",
          "tileview",
          "fullscreen",
        ],
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);
    setJitsiApi(api);

    api.addListener("connectionQualityChange", (quality) => {
      setConnectionQuality(quality);
    });

    return () => {
      api.dispose();
    };
  }, [demoCallOpen]);

  // Redirect after passport generated
  useEffect(() => {
    if (passportGenerated) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
navigate("/passport-status-page", {
  state: {
    status: "accepted",
passportNumber: passportGenerated,
  },
});
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [passportGenerated, navigate]);

  // Dates for date input (today to +1 month)
  const todayISO = new Date().toISOString().split("T")[0];
  const maxDateISO = new Date(
    new Date().setMonth(new Date().getMonth() + 1)
  )
    .toISOString()
    .split("T")[0];

  const handleSchedule = () => {
    if (!scheduledDate || !scheduledTime) {
      alert("Please select both date and time.");
      return;
    }
   setPassportGenerated("scheduled");

  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-white p-8 font-sans text-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-blue-800 text-center">
        KYC Verification Dashboard
      </h1>

      {/* KYC Steps Timeline */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-12 relative">
        {kycSteps.map((step, idx) => {
          const done = idx < animatedStep;
          return (
            <div
              key={step}
              className="flex flex-col items-center relative z-10"
              style={{ minWidth: "140px" }}
            >
              <div
                className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-colors duration-500 ${
                  done
                    ? "bg-blue-700 border-blue-700 text-white"
                    : "bg-transparent border-blue-300 text-blue-300"
                }`}
              >
                ✓
              </div>
              <p
                className={`mt-3 text-center font-semibold text-sm ${
                  done ? "text-blue-800" : "text-blue-300"
                }`}
              >
                {step}
              </p>
              {/* Arrow line except for last */}
              {idx !== kycSteps.length - 1 && (
                <div
                  className={`absolute top-5 left-full h-1 w-16 ${
                    idx < animatedStep - 1
                      ? "bg-blue-700 transition-all duration-500"
                      : "bg-blue-200"
                  }`}
                  style={{ marginLeft: 8 }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Demo Call Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Demo Call</h2>

        {!demoCallOpen ? (
          <button
            onClick={() => setDemoCallOpen(true)}
            className="bg-blue-700 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-800 transition duration-300"
          >
            Start Demo Call
          </button>
        ) : (
          <>
            <div
              ref={jitsiContainerRef}
              className="w-full rounded-md overflow-hidden shadow-inner mb-4"
              style={{ minHeight: "400px" }}
            />
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">
                Connection Quality:{" "}
                <span
                  className={`font-bold ${
                    connectionQuality > 80
                      ? "text-green-600"
                      : connectionQuality > 40
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {connectionQuality === null
                    ? "Checking..."
                    : connectionQuality + "%"}
                </span>
              </p>
            </div>
            <button
              onClick={() => setDemoCallOpen(false)}
              className="bg-red-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-600 transition duration-300"
            >
              End Demo Call
            </button>
          </>
        )}
      </div>

      {/* Schedule Verification Call Section */}
      <section className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-800">
          Schedule Verification Call 
        </h2>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Date input */}
          <div className="flex flex-col flex-1">
            <label htmlFor="date" className="font-semibold mb-2 text-blue-700">
              Select Date (IST)
            </label>
            <input
              id="date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              min={todayISO}
              max={maxDateISO}
            />
          </div>

          {/* Time slot dropdown */}
          <div className="flex flex-col flex-1">
            <label htmlFor="time" className="font-semibold mb-2 text-blue-700">
              Select Time Slot (IST)
            </label>
            <select
              id="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select a time slot --</option>
              {indianTimeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Button */}
          <div className="flex justify-center items-end">
            <button
              onClick={handleSchedule}
              disabled={passportGenerated}
              className={`${
                passportGenerated
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              } text-white font-semibold rounded-md px-6 py-3 shadow-md transition duration-300`}
            >
              {passportGenerated ? "Scheduled" : "Schedule Verification Call"}
            </button>
          </div>
        </div>

        {/* Passport Display and Redirect */}
        {passportGenerated && (
          <div className="mt-8 bg-blue-100 text-blue-900 p-4 rounded-md font-sans text-center text-lg shadow-inner">
            <p className="font-semibold">
              Verification call scheduled for{" "}
              <span className="underline">{scheduledDate}</span> at{" "}
              <span className="underline">{scheduledTime} IST</span>.
            </p>
            <p className="mt-2 text-sm text-gray-700">
              Redirecting to verification status page in {redirectCountdown}{" "}
              second{redirectCountdown !== 1 ? "s" : ""}...
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
