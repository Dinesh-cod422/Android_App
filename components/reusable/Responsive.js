import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const baseWidth = 350;
const baseHeight = 680;

const scaleWidth = size => width / baseWidth * size;
const scaleHeight = size => height / baseHeight * size;
//const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

export {scaleWidth, scaleHeight};