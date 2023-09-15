/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { SvgXml } from 'react-native-svg';
import {
  deleteAmityFile,
  uploadVideoFile,
} from '../../providers/file-provider';
import { closeIcon, playBtn } from '../../svg/svg-xml-list';
import { createStyles } from './styles';
import { createThumbnail, type Thumbnail } from 'react-native-create-thumbnail';

interface OverlayImageProps {
  source: string;
  onClose?: (originalPath: string) => void;
  onLoadFinish?: (
    fileId: string,
    fileUrl: string,
    fileName: string,
    index: number,
    originalPath: string,
    thumbNail: string
  ) => void;
  index?: number;
  isUploaded: boolean;
  fileId?: string;
  thumbNail: string;
  onPlay: (fileUrl: string) => void;
}
const LoadingVideo = ({
  source,
  onClose,
  index,
  onLoadFinish,
  isUploaded = false,
  thumbNail,
  onPlay,
  fileId,
}: OverlayImageProps) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [thumbNailImage, setThumbNailImage] = useState(thumbNail ?? '')
  const styles = createStyles();
  const handleLoadEnd = () => {
    setLoading(false);
  };

  const processThumbNail = async () => {
    const thumbNail: Thumbnail = await createThumbnail({
      url: source,
    })
    setThumbNailImage(thumbNail.path)
  }
  useEffect(() => {
    processThumbNail()
  }, [thumbNail])

  useEffect(() => {
    if (progress === 100) {
      setIsProcess(true);
    }
  }, [progress]);

  const uploadFileToAmity = useCallback(async () => {
    const file: Amity.File<any>[] = await uploadVideoFile(
      source,
      (percent: number) => {
        setProgress(percent);
      }
    );
    if (file) {
      setIsProcess(false);
      handleLoadEnd();
      onLoadFinish &&
        onLoadFinish(
          file[0]?.fileId as string,
          file[0]?.fileUrl as string,
          file[0]?.attributes.name as string,
          index as number,
          source,
          thumbNail
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const handleDelete = async () => {
    if (fileId) {
      await deleteAmityFile(fileId as string);
      onClose && onClose(source);
    }
  };
  useEffect(() => {
    if (isUploaded) {
      setLoading(false);
    } else {
      uploadFileToAmity();
    }
  }, [fileId, isUploaded, source]);
  const handleOnPlay = () => {
    onPlay && onPlay(source);
  };
  return (
    <View style={styles.container}>
      {!loading && (
        <TouchableOpacity style={styles.playButton} onPress={handleOnPlay}>
          <SvgXml xml={playBtn} width="50" height="50" />
        </TouchableOpacity>
      )}
      {thumbNailImage ? <Image
        source={{ uri: thumbNailImage }}
        style={[
          styles.image,
          loading ? styles.loadingImage : styles.loadedImage,
        ]}
      /> : <View style={styles.image} />}

      {loading && (
        <View style={styles.overlay}>
          {isProcess ? (
            <Progress.CircleSnail size={60} borderColor="transparent" />
          ) : (
            <Progress.Circle
              progress={progress / 100}
              size={60}
              borderColor="transparent"
              unfilledColor="#ffffff"
            />
          )}
        </View>
      )}
      {!loading && (
        <TouchableOpacity style={styles.closeButton} onPress={handleDelete}>
          <SvgXml xml={closeIcon} width="12" height="12" />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default LoadingVideo;
