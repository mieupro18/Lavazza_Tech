import {StyleSheet} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
const commonStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#100A45',
    height: responsiveScreenHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStyleInHeader: {
    width: responsiveScreenWidth(50),
    height: responsiveScreenHeight(5),
    resizeMode: 'contain',
  },
  spinnerContainer: {
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  spinnerTextStyle: {
    textAlign: 'center',
    fontSize: responsiveScreenFontSize(1.5),
  },
  card: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cardHeader: {
    justifyContent: 'center',
    backgroundColor: '#100A45',
    height: responsiveScreenHeight(3),
    width: '75%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  cardHeaderTextStyle: {
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: 'bold',
    color: '#fff',
  },
  flexRowContainer: {
    flexDirection: 'row',
  },
  flexColumnContainer: {
    flexDirection: 'column',
    flex: 1,
    marginTop: '5%',
  },
  keyTextContainer: {width: '50%', padding: '3%'},
  valueTextContainer: {width: '50%', padding: '3%'},
  keyTextStyle: {
    fontSize: responsiveScreenFontSize(1.8),
    color: '#100A45',
    fontWeight: 'bold',
  },
  valueTextStyle: {fontSize: responsiveScreenFontSize(1.8)},
  buttonStyle: {
    justifyContent: 'center',
    width: '40%',
    marginTop: '5%',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#100A45',
  },
  buttonIconStyle: {marginLeft: 'auto'},
  buttonTextStyle: {fontSize: responsiveScreenFontSize(1.8), color: '#fff'},
  cancelButtonIconStyle: {marginLeft: 'auto', color: '#000'},
  cardItemForm: {flexDirection: 'column', alignItems: 'flex-start'},
  formStyle: {width: '100%'},
  formItemTransparentStyle: {
    alignSelf: 'center',
    borderColor: 'transparent',
    marginTop: '5%',
  },
  formItemStyle: {alignSelf: 'center'},
  labelStyle: {
    color: '#100A45',
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: 'bold',
  },
  textInput: {
    height: responsiveScreenHeight(5),
    width: '80%',
    textAlign: 'center',
    color: '#000',
    borderColor: 'gray',
    borderWidth: responsiveScreenWidth(0.1),
    borderRadius: responsiveScreenWidth(2),
    backgroundColor: '#f1f2f6',
    marginTop: '2%',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  cancelButtonStyle: {
    justifyContent: 'center',
    width: '40%',
    marginTop: '5%',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#f1f2f6',
  },
  cancelButtonTextStyle: {
    color: '#000',
    fontSize: responsiveScreenFontSize(1.8),
  },
  errorContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
  },
  warningImageStyle: {
    color: '#CECDCB',
    marginTop: '10%',
  },
  errorTextStyle: {
    textAlign: 'center',
    fontSize: responsiveScreenFontSize(1.5),
  },
  tryAgainButtonStyle: {
    width: responsiveScreenWidth(25),
    height: responsiveScreenHeight(5),
    borderRadius: responsiveScreenHeight(1),
    backgroundColor: '#100A45',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveScreenHeight(2),
  },
  tryAgainButtonTextStyle: {
    color: 'white',
    fontSize: responsiveScreenFontSize(1.8),
  },
});

export {commonStyles};
