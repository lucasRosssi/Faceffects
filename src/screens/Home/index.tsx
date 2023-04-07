import { useEffect, useCallback, useState, useMemo } from 'react';
import { View } from 'react-native';
import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, WithSpringConfig } from 'react-native-reanimated';

import { styles } from './styles';
import { FaceExpressionEnum } from '../../enums/FaceExpressionEnum';
import { FaceExpressions } from '../../static/FaceExpressions';

const { container, camera } = styles;

interface Position {
  x: number;
  y: number;
}

interface Size {
  height: number;
  width: number;
}

interface Face {
  bottomMouthPosition: Position;
  bounds: {
    origin: Position;
    size: Size;
  };
  faceID: number;
  leftCheekPosition: Position;
  leftEarPosition: Position;
  leftEyeOpenProbability: number;
  leftEyePosition: Position;
  leftMouthPosition: Position;
  noseBasePosition: Position;
  rightCheekPosition: Position;
  rightEarPosition: Position;
  rightEyeOpenProbability: number;
  rightEyePosition: Position;
  rightMouthPosition: Position;
  rollAngle: number;
  smilingProbability: number;
  yawAngle: number;

}

const springConfig: WithSpringConfig = { mass: 0.3 }

export const Home: React.FC = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [faceDetected, setFaceDetected] = useState<boolean>();
  const [expression, setExpression] = useState<FaceExpressionEnum>(FaceExpressionEnum.NEUTRAL);

  const getCurrentExpression = useCallback((face: Face) => {
    if (
      (face.leftEyeOpenProbability < 0.98 && face.rightEyeOpenProbability >= 0.1) ||
      (face.rightEyeOpenProbability < 0.98 && face.leftEyeOpenProbability >= 0.1)) {
      return FaceExpressionEnum.WINKING;
    }

    if (face.smilingProbability > 0.95) {
      return FaceExpressionEnum.SMILING;
    }

    return FaceExpressionEnum.NEUTRAL;
  }, [])

  const faceValues = useSharedValue<Face['bounds']>({
    size: {
      width: 0,
      height: 0,
    },
    origin: {
      x: 0,
      y: 0,
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    zIndex: 1,
    width: withSpring(faceValues.value.size.width, springConfig),
    height: withSpring(faceValues.value.size.height, springConfig),
    transform: [
      { translateX: withSpring(faceValues.value.origin.x, springConfig) },
      { translateY: withSpring(faceValues.value.origin.y, springConfig) },
    ],
  }))

  const handleFacesDetected = useCallback(({ faces }: FaceDetectionResult) => {
    const [face] = faces as Face[];

    if (!face) {
      setFaceDetected(false);
      return;
    }

    const { size, origin } = face.bounds;

    faceValues.value = {
      size,
      origin,
    }

    setFaceDetected(true);
    setExpression(getCurrentExpression(face));
  }, [])

  useEffect(() => {
    requestPermission();
  }, [])

  if (!permission?.granted) {
    return null;
  }

  return (
    <View style={container}>
      {
        faceDetected && (
          <Animated.Image source={FaceExpressions[expression].image} style={animatedStyle} />
        )
      }
      <Camera
        style={camera}
        type={CameraType.front}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.accurate,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      />
    </View>
  )
}
