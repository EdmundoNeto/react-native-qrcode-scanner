'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Dimensions,
  Vibration,
  Animated,
  Easing,
  View,
  Platform,
  Text
} from 'react-native';

import Camera from 'react-native-camera'


export default class QRCodeScanner extends Component {
  static propTypes = {
    onRead: PropTypes.func.isRequired,
    reactivate: PropTypes.bool,
    reactivateTimeout: PropTypes.number,
    fadeIn: PropTypes.bool,
    showMarker: PropTypes.bool,
    customMarker: PropTypes.element,
    cameraStyle: PropTypes.any,
    topViewStyle: PropTypes.any,
    bottomViewStyle: PropTypes.any,
    topContent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    bottomContent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    overlayBackgroundColor: PropTypes.string,
    labelText: PropTypes.string
  }

  static defaultProps = {
    overlayBackgroundColor: "#333333",
    onRead: () => (console.log('QR code scanned!')),
    reactivate: false,
    reactivateTimeout: 0,
    fadeIn: true,
    showMarker: false,
    showOverlay: false,
    labelText: "LEIA O QR CODE"
  }

  constructor(props) {
    super(props);
    this.state = {
      scanning: false,
      fadeInOpacity: new Animated.Value(0)
    }
    this.timeout = null
    this._handleBarCodeRead = this._handleBarCodeRead.bind(this);
  }

  componentDidMount() {
    if (this.props.fadeIn) {
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(
         this.state.fadeInOpacity,
         {
           toValue: 1,
           easing: Easing.inOut(Easing.quad),
         },
        )
      ]).start();
    }
   }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  _setScanning(value) {
    this.setState({ scanning: value });
  }

  _handleBarCodeRead(e) {
    if (!this.state.scanning) {
      Vibration.vibrate();
      this._setScanning(true);
      this.props.onRead(e)
      if (this.props.reactivate) {
        this.timeout = setTimeout(() => (this._setScanning(false)), this.props.reactivateTimeout);
      }
    }
  }

  _renderTopContent() {
    if (this.props.topContent) {
      return this.props.topContent;
    }
    return null;
  }

  _renderBottomContent() {
    if (this.props.bottomContent) {
      return this.props.bottomContent;
    }
    return null;
  }

  _renderCameraMarker() {
    if (this.props.showMarker) {
      return (
      <View style={[styles.rectangleContainer, this.props.rectangleContainerStyle]}>
        <View style={[styles.rectangle, this.props.rectangleStyle]}/>
      </View>
      )
    }
    return null;
  }

  _renderCamera() {
    if (this.props.fadeIn) {
      return (
        <Animated.View
          style={{
            opacity: this.state.fadeInOpacity,
            backgroundColor: 'transparent'
        }}>
          <Camera style={[styles.camera, this.props.cameraStyle]} onBarCodeRead={this._handleBarCodeRead.bind(this)}>
            {this._renderCameraMarker()}
          </Camera>
        </Animated.View>
      )
    }
    return (
      <Camera style={[styles.camera, this.props.cameraStyle]} onBarCodeRead={this._handleBarCodeRead.bind(this)}>
        {this._renderCameraMarker()}
      </Camera>
    )
  }

_renderOverlay() {
  if (this.props.showOverlay) {
    return (
    <View style={styles.overlayContainer}>
      <View style={[styles.overlayTop, {backgroundColor: this.props.overlayBackgroundColor}]}>
        <Text style={styles.label}>{this.props.labelText}</Text>
      </View>
      <View style={[styles.overlayBottom, {backgroundColor: this.props.overlayBackgroundColor}]}/>
    </View>
    )
  }
  return null
}

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={[styles.infoView, this.props.topViewStyle]}>
          {this._renderTopContent()}
        </View>
        {this._renderCamera()}
        {this._renderOverlay()}
        <View style={[styles.infoView, this.props.bottomViewStyle]}>
          {this._renderBottomContent()}
        </View>
        {this._renderOverlay()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  infoView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },

  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  overlayContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
 },
 overlayBottom: {
   position: 'absolute',
   height: 80,
   left: 0,
   right: 0,
   bottom: 0,
 },
 overlayTop: {
   position: 'absolute',
   height: 80,
   left: 0,
   right: 0,
   top: 0,
   justifyContent: 'center',
   alignItems: 'center'
 },
label: {
  backgroundColor:'transparent',
  color:'white',
  textAlign: 'center'
}
})
