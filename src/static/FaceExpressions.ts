import { ImageSourcePropType } from 'react-native';

import { FaceExpressionEnum } from '../enums/FaceExpressionEnum';

import neutralPng from '../assets/neutral.png';
import smilingPng from '../assets/smiling.png';
import winkingPng from '../assets/winking.png';
import lightWowPng from '../assets/light_wow.png';

type FaceExpressionsStatic = Record<FaceExpressionEnum, {
  image: ImageSourcePropType
}>;

export const FaceExpressions: FaceExpressionsStatic = {
  [FaceExpressionEnum.NEUTRAL]: {
    image: neutralPng,
  },
  [FaceExpressionEnum.SMILING]: {
    image: smilingPng,
  },
  [FaceExpressionEnum.WINKING]: {
    image: winkingPng,
  },
  [FaceExpressionEnum.LIGHT_WOW]: {
    image: lightWowPng,
  },
}