import React from 'react';
import { PixelRatio } from 'react-native';
let pixelRatio = PixelRatio.get();
let {width, height} = require('Dimensions').get('window');

export const normalize = (size) => {
    switch (true){
        case (pixelRatio < 1.4):
            return size * 0.8;
            break;
        case (pixelRatio < 2.4):
            return size * 1.15;
            break;
        case (pixelRatio < 3.4):
            return size * 1.35;
            break;
        default:
            return size * 1.5;
    }
}

export const normalizeFont = (size) => {
  if (pixelRatio < 1.4){
      return Math.sqrt((height*height)+(width*width))*(size/175);
  }
  return Math.sqrt((height*height)+(width*width))*(size*.01);
}
export const getImageSize = () => {
    if (pixelRatio < 1.4){
        return height*0.06
    }
        return height*0.14
}
export const getMargin = () => {
    if (pixelRatio < 1.4){
        return height*0.06
    }
    return height*0.02
}
export const getArrowSize = () => {
    if (pixelRatio < 1.4){
        return height*0.04
    }
        return height*0.08
}
export const getLikeImageSize = () => {
    if (pixelRatio < 1.4){
        return height*0.06
    }
        return height*0.12
}
export const getArrowMargin = () => {
    if (pixelRatio < 1.4){
        return height*0.01
    }
    return 0
}
export const getOverlayMargin = (margin) => {
    if (pixelRatio < 1.4){
        return height*margin//0.18
    }
    return 0
}

