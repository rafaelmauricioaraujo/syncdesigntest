import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { getPlatforms, isPlatform } from '@ionic/react';
import { Box, IconButton } from '@mui/material';
import { Aperture, CameraRotate, Check, Flashlight, VideoCamera, X } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import Webcam from 'react-webcam';



import { toast } from '@/components/core/toaster';




interface VideoConstraints {
  id: string;
  videoConstraints: {
    width: { ideal: number };
    height: { ideal: number };
  };
  label: string;
  hasTorch: boolean;
  facingMode: 'user' | 'environment';
  resolution: number;
}

const recordingDotSx = {
  width: 40,
  height: 40,
  backgroundColor: 'red',
  borderRadius: '50%',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.2)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
};

// Save device details

interface CameraScreenProps {
  isCameraOpen: boolean;
  setIsCameraOpen: (isOpen: boolean) => void;
  setImages: (images: string[]) => void;
  frontCamera: VideoConstraints | undefined;
  backCamera: VideoConstraints | undefined;
  allDevices: MediaDeviceInfo[];
  devicesNames: MediaDeviceInfo[];
  capabilities: Record<string, MediaTrackCapabilities>;
  currentSettings: Record<string, MediaTrackSettings>;
}

export default function CameraScreen({
  isCameraOpen,
  setIsCameraOpen,
  frontCamera,
  backCamera,
  allDevices,
  devicesNames,
  capabilities,
  currentSettings,
  setImages,
}: CameraScreenProps): React.FC {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);

  // const [canSelfie, setCanSelfie] = useState(true);

  const [facingModeState, setFacingModeState] = useState<'environment' | 'user'>('environment');

  const [isIosDevice, setIsIosDevice] = useState(false);

  const hiddenWebcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);

  // CSS ADJUSTEMTS FOR CAMERA IN ALL DEVICES

  // Handle getting user media and updating constraints
  const [videoConstraints, setVideoConstraints] = useState<MediaTrackConstraints>({
    width: { min: 1280, ideal: 1980, max: 8192 },
    height: { min: 720, ideal: 1980, max: 8192 },
  });

  // LOGGERS
  const [plataforms, setPlataforms] = useState<string[]>([]);
  const [isDeviceNative, setNative] = useState<Boolean[]>(false);

  const stopAllTracks = () => {
    // Stops all media tracks to ensure cameras are closed
    const hiddenStream = hiddenWebcamRef.current?.stream;
    if (hiddenStream) {
      hiddenStream?.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCancelPhotos = () => {
    setIsCameraOpen(false);
    stopAllTracks();
  };

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setNative(true);
    }
    const handleResize = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // INFRASTRUCTURE FOR CAMERA

  useEffect(() => {
    setFacingModeState('environment');
  }, [isCameraOpen]);

  useEffect(() => {
    if (!frontCamera || !backCamera) return;
    if (facingModeState === 'user' && frontCamera) {
      setVideoConstraints({
        ...frontCamera.videoConstraints,
        focusMode: 'continuous',
        deviceId: frontCamera.deviceId ? { exact: frontCamera.deviceId } : undefined,
        // advanced: [{ imageStabilization: true }] // Enable stabilization
      });
      setHasTorch(frontCamera.hasTorch);
    } else if (backCamera) {
      setVideoConstraints({
        ...backCamera.videoConstraints,
        focusMode: 'continuous',
        deviceId: backCamera.deviceId ? { exact: backCamera.deviceId } : undefined,
        // advanced: [{ imageStabilization: true }] // Enable stabilization
      });
      setHasTorch(backCamera.hasTorch);
    }
  }, [facingModeState, frontCamera, backCamera]);

  // console.log(videoConstraints);

  const useNoZoomEffect = (isActive) => {
    useEffect(() => {
      setPlataforms(getPlatforms());
      if (isPlatform('ios')) {
        setIsIosDevice(true);
        const videoElement = hiddenWebcamRef.current;
        if (videoElement) {
          videoElement.controls = false;
        }
      }
      const dialogElements = Array.from(document.getElementsByClassName('MuiDialog-paperScrollPaper'));
      if (isActive) {
        document.body.style.touchAction = 'none';
        dialogElements.forEach((element) => {
          element.style.width = '100vw';
          element.style.margin = '0px';
          element.style.maxHeight = '100vh';
        });
      } else {
        document.body.style.touchAction = '';
        dialogElements.forEach((element) => {
          element.style.width = 'calc(100% - 32px)';
          element.style.margin = '32px';
          element.style.maxHeight = 'calc(100% - 32px)';
        });
      }
      return () => {
        document.body.style.touchAction = '';
        dialogElements.forEach((element) => {
          element.style.width = 'calc(100% - 32px)';
          element.style.margin = '32px';
          element.style.maxHeight = 'calc(100% - 32px)';
        });
      };
    }, [isActive]);
  };

  useNoZoomEffect(isCameraOpen);

  // CREATE CONTENT FROM WEBCAM

  const handleTakePhoto = useCallback(() => {
    if (hiddenWebcamRef.current) {
      const newPhoto = hiddenWebcamRef.current.getScreenshot();
      if (newPhoto) {
        setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
      }
    }
  }, [hiddenWebcamRef]);

  const handleDeletePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, idx) => idx !== index));
  };

  const handleSavePhotos = () => {
    const imageFiles = photos.map((photo, idx) => {
      if (typeof photo === 'string') {
        // Convert base64 string to Blob
        const byteString = atob(photo.split(',')[1]);
        const mimeString = photo.split(',')[0].split(':')[1].split(';')[0];
        const byteNumbers = new Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          byteNumbers[i] = byteString.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeString });

        // Generate the current timestamp using dayjs
        const timestamp = dayjs().format('YYYYMMDDHHmmss');

        // Use the timestamp for the filename
        return new File([blob], `${timestamp}-photo${idx}.jpeg`, { type: mimeString });
      }
      return photo;
    });

    setImages(imageFiles);
    setIsCameraOpen(false);
    stopAllTracks();
  };

  const handleStartRecording = async () => {
    if (!hiddenWebcamRef.current) return;

    try {
      const stream = hiddenWebcamRef.current.stream;
      if (!stream) {
        toast.warning("No stream available, can't start recording");
        return;
      }

      // const SCREEN_SIZE_VERTICAL = videoConstraints?.height?.ideal || 1280;
      // const SCREEN_SIZE_HORIZONTAL = videoConstraints?.width?.ideal || 720;
      // const FPS = 1;
      // const PIXEL_COLOR_DEPTH = 1; // 24 bits per pixel

      // // Calculate BITRATE
      // const BITRATE = (SCREEN_SIZE_VERTICAL * SCREEN_SIZE_HORIZONTAL * FPS * PIXEL_COLOR_DEPTH);

      // // Format BITRATE with underscores for readability
      // const formattedBitrate = BITRATE.toLocaleString('en-US').replace(/,/g, '_');
      
      // console.log(`Bitrate: ${formattedBitrate} bps`);
      // toast.warning(`Bitrate: ${formattedBitrate} bps`);
      
      // Specify the video options, including increased bitrate
      const videoOptions = {
      mimeType: 'video/mp4',
      // videoBitsPerSecond: BITRATE,
      };

      const mediaRecorder = new MediaRecorder(stream, videoOptions);
      videoChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/mp4' });
        const videoFile = new File([videoBlob], `video.mp4`, { type: 'video/mp4' });
        setPhotos((prevPhotos) => [...prevPhotos, videoFile]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error(`Could not start recording ${error}`);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleFlashlight = () => {
    setIsTorchOn((prevIsTorchOn) => {
      if (hiddenWebcamRef.current) {
        const track = hiddenWebcamRef?.current?.stream?.getVideoTracks()[0];
        void track?.applyConstraints({
          advanced: [{ torch: !prevIsTorchOn }],
        });
      }
      return !prevIsTorchOn;
    });
  };

  const switchFacingMode = useCallback(() => {
    setFacingModeState((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
  }, []);

  return isCameraOpen ? (
    <div
      className="camera-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100dvw',
        height: '100dvh',
        zIndex: 8,
        backgroundColor: 'black',
      }}
    >
      {isIosDevice ? (
          <Webcam
            audio={false}
            className="webcam-hidden"
            controls={false}
            forceScreenshotSourceSize
            imageSmoothing
            playsInline
            ref={hiddenWebcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.90}
            style={{
              opacity: 0,
              width: 'auto',
              height: '1980px',
              objectFit: 'cover',
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: -10,
            }}
            videoConstraints={{
              ...videoConstraints,
              facingMode: { ideal: facingModeState },
              focusMode: 'continuous',
            }}
          />
      ) : (
          <Webcam
            audio={false}
            className="webcam-hidden"
            controls={false}
            forceScreenshotSourceSize
            imageSmoothing
            ref={hiddenWebcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.90}
            style={{
              width: '100%',
              height: '90%',
              objectFit: 'cover',
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9,
            }}
            videoConstraints={videoConstraints}
          />
      )}

      {/* DIAGNOSITC SCREEEN FOR DEBUGGING */}

      {import.meta.env.VITE_BETA === 'flex' && (
        <div
          style={{
            maxWidth: '50vw',
            maxHeight: '50vh', // Optional: to ensure the div doesn't grow too large vertically
            top: '10%',
            left: '10%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 100,
            // Optional: adds some padding for better visuals
          }}
        >
          <p style={{ color:"red", fontSize: 'small', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>CURRENT DEVICE</p>
          {Object.entries(videoConstraints).map(([key, value], index) => (
            <div key={index} style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>
              <p>{`${key}: ${JSON.stringify(value)}`}</p>
            </div>
          ))}

          <p style={{ fontSize: 'small', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>FRONT CAMERA</p>
          <p style={{ fontSize: 'small', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(frontCamera)}
          </p>
          <p style={{ fontSize: 'small', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>BACK CAMERA</p>
          <p style={{ fontSize: 'small', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(backCamera)}
          </p>

          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>PLATAFORM LOGS</p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>Is IOS: {String(isIosDevice)}</p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>Plataforms: {String(plataforms)}</p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>Facing Mode: {String(facingModeState)}</p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
            is Native - {String(isDeviceNative)} {String(Capacitor.isNativePlatform())}
          </p>

          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>CAPABILITIES</p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>
            {JSON.stringify(capabilities)}
          </p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>
            {JSON.stringify(capabilities?.height)}
          </p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>
            {JSON.stringify(capabilities?.width)}
          </p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>
            {JSON.stringify(capabilities?.zoom)}
          </p>

          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>CURRENT SETTINGS</p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>
            {JSON.stringify(currentSettings)}
          </p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>
            {JSON.stringify(currentSettings?.height)}
          </p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>
            {JSON.stringify(currentSettings?.width)}
          </p>
          <p style={{ fontSize: 'small', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>DEVICE NAMES</p>
          {devicesNames.map((device, index) => (
            <p
              style={{
                fontSize: 'small',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                color: 'white',
                fontWeight: 'bold',
              }}
              key={index}
            >
              {JSON.stringify(device)}
            </p>
          ))}
          <p style={{ fontSize: 'small', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>VIDEO DEVICES NAMES</p>
          {allDevices?.map((device, index) => (
            <p
              style={{
                fontSize: 'small',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                color: 'white',
                fontWeight: 'bold',
              }}
              key={index}
            >
              {JSON.stringify(device)}
            </p>
          ))}
        </div>
      )}
      <IconButton
        onClick={switchFacingMode}
        size="100"
        sx={{
          position: 'fixed',
          bottom: 110,
          left: '51%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          color: 'black',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <CameraRotate size={32} weight="fill" />
      </IconButton>
      {hasTorch && !isIosDevice && (
        <IconButton
          onClick={toggleFlashlight}
          size="100"
          sx={{
            position: 'fixed',
            bottom: 110,
            right: '3%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            color: isTorchOn ? 'black' : 'white',
            backgroundColor: isTorchOn ? 'rgba(255, 255, 0, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <Flashlight size={32} weight="fill" />
        </IconButton>
      )}
      {photos.length > 0 && (
        <Box>
          <div
            className="custom-scrollbar"
            style={{
              position: 'absolute',
              top: '2dvh',
              left: '2dvw',
              display: 'flex',
              gap: '1vw',
              zIndex: 11,
              overflowX: 'auto',
              maxWidth: '90vw',
            }}
          >
            {photos.map((photo, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                {typeof photo === 'string' ? (
                  <img
                    alt={`Thumbnail ${idx}`}
                    src={photo}
                    style={{
                      width: '20dvw',
                      height: '20dvw',
                      objectFit: 'cover',
                      border: '2px solid #fff',
                    }}
                  />
                ) : (
                  <video
                    autoPlay
                    className="hidden-ios-video-controls"
                    controls={false}
                    loop
                    muted
                    playsInline
                    src={URL.createObjectURL(photo)}
                    style={{
                      width: '20vw',
                      height: '20vw',
                      objectFit: 'cover',
                      border: '2px solid #fff',
                    }}
                  />
                )}
                <IconButton
                  onClick={() => handleDeletePhoto(idx)}
                  size="small"
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '4px',
                    background: 'rgba(255, 0, 0, 0.7)',
                    color: 'white',
                    fontSize: '8px',
                    height: '25px',
                    width: '25px',
                    borderRadius: '10px',
                  }}
                >
                  <X size={16} />
                </IconButton>
              </div>
            ))}
          </div>
        </Box>
      )}
      <Box
        sx={{
          position: 'absolute',
          bottom: '2dvh',
          left: '5dvw',
          right: '5dvw',
          display: 'flex',
          justifyContent: 'space-around',
          gap: '5dvw',
        }}
      >
        {isRecording ? (
          <Box key="recording-dot" onClick={handleStopRecording} sx={recordingDotSx} />
        ) : (
          <>
            <IconButton
              color="warning"
              onClick={() => {
                handleCancelPhotos();
              }}
              size="100px"
            >
              <X size={32} />
            </IconButton>
            <IconButton color="info" onClick={handleTakePhoto} size="100px">
              <Aperture size={32} />
            </IconButton>
            <IconButton color="error" onClick={handleStartRecording} size="100px">
              <VideoCamera size={32} />
            </IconButton>
            <IconButton color="success" onClick={handleSavePhotos} size="100px">
              <Check size={32} />
            </IconButton>
          </>
        )}
      </Box>
    </div>
  ) : null;
}