// Inspiration: https://dribbble.com/shots/2343572-Countdown-timer
// 👉 Output of the code: https://twitter.com/mironcatalin/status/1321856493382238208

import * as React from "react";
import {
  Vibration,
  StatusBar,
  Easing,
  TextInput,
  Dimensions,
  Animated,
  TouchableOpacity,
  FlatList,
  Text,
  View,
  StyleSheet,
} from "react-native";
const { width, height } = Dimensions.get("window");
const colors = {
  black: "#323F4E",
  red: "#F76A6A",
  text: "#ffffff",
};

import * as Font from "expo-font";
import { useFonts } from "@use-expo/font";

const timers = [...Array(13).keys()].map((i) => (i === 0 ? 1 : i * 5));
const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [duration, setDuration] = React.useState(timers[0]);
  const inptuRef = React.useRef();
  const timerAniamtion = React.useRef(new Animated.Value(height)).current;
  const textInputAniamtion = React.useRef(new Animated.Value(timers[0]))
    .current;
  const buttonAniamtion = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const listener = textInputAniamtion.addListener(({ value }) => {
      inptuRef?.current?.setNativeProps({
        text: Math.ceil(value).toString(),
      });
    });

    return () => {
      textInputAniamtion.removeListener(listener);
      textInputAniamtion.removeAllListeners();
    };
  });

  const animation = React.useCallback(() => {
    textInputAniamtion.setValue(duration);
    Animated.sequence([
      Animated.timing(buttonAniamtion, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(timerAniamtion, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textInputAniamtion, {
          toValue: 0,
          duration: duration * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(timerAniamtion, {
          toValue: height,
          duration: duration * 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      Vibration.cancel();
      Vibration.vibrate();
      textInputAniamtion.setValue(duration);
      Animated.timing(buttonAniamtion, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [duration]);

  const opacity = buttonAniamtion.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const translateY = buttonAniamtion.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const textOpacit = buttonAniamtion.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            width,
            height,
            backgroundColor: colors.red,
            transform: [{ translateY: timerAniamtion }],
          },
        ]}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 100,
            opacity,
            transform: [
              {
                translateY,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={animation}>
          <View style={styles.roundButton} />
        </TouchableOpacity>
      </Animated.View>
      <View
        style={{
          position: "absolute",
          top: height / 3,
          left: 0,
          right: 0,
          flex: 1,
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            width: ITEM_SIZE,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            opacity: textOpacit,
          }}
        >
          <TextInput
            ref={inptuRef}
            style={styles.text}
            defaultValue={duration.toString()}
          />
        </Animated.View>
        <Animated.FlatList
          horizontal
          data={timers}
          keyExtractor={(item) => item.toString()}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, opacity }}
          contentContainerStyle={{
            paddingHorizontal: ITEM_SPACING,
          }}
          onMomentumScrollEnd={(ev) => {
            const ind = Math.round(ev.nativeEvent.contentOffset.x / ITEM_SIZE);
            setDuration(timers[ind]);
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: true,
            }
          )}
          snapToInterval={ITEM_SIZE}
          decelerationRate={"fast"}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
              (index + 1) * ITEM_SIZE,
            ];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
            });
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.7, 1, 0.7],
            });
            return (
              <View
                style={{
                  width: ITEM_SIZE,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Animated.Text
                  style={[
                    styles.text,
                    {
                      opacity,

                      transform: [
                        {
                          scale,
                        },
                      ],
                    },
                  ]}
                >
                  {item}
                </Animated.Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  roundButton: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: colors.red,
  },
  text: {
    fontSize: ITEM_SIZE * 0.8,

    color: colors.text,
    fontWeight: "900",
  },
});
