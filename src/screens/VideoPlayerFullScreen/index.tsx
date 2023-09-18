import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
// import Slider from '@react-native-community/slider';
// import { useTranslation } from 'react-i18next';

import { StyleSheet, Text, View } from 'react-native';
import Video from 'react-native-video';
import type { RootStackParamList } from '../../routes/RouteParamList';
import { useRoute, type RouteProp, useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../svg/svg-xml-list';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './styles';


const VideoPlayerFull = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'VideoPlayer'>>();
  const { source } = route.params
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const onPlayPausePress = () => {
    // if (isPlaying) {
    //   videoRef.current.pause();
    // } else {
    //   videoRef.current.play();
    // }
    setIsPlaying(!isPlaying);
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const onEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    videoRef.current.seek(0);
  };

  const onSliderValueChange = (value) => {
    videoRef.current.seek(value);
    setCurrentTime(value);
  };

  const onClose = () => {
    console.log('onClose:')
    navigation.goBack()
  }
  return (
    <View style={styles.container}>
 

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <SvgXml xml={closeIcon} width="16" height="16" />
        </TouchableOpacity>

      <Video
        ref={videoRef}
        source={{ uri: source }}
        style={styles.video}
        onProgress={onProgress}
        onEnd={onEnd}
        resizeMode='contain'
        paused={!isPlaying}
        onLoad={(data) => {
          setDuration(data.duration);
        }}
      />

      {/* Video Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={onPlayPausePress}>
          <Text style={styles.controlButton}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>

        <Text style={styles.timeLabel}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>

        {/* <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onValueChange={onSliderValueChange}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        /> */}
      </View>
    </View>
  );
};

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};


export default VideoPlayerFull;