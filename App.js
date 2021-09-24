import React, {
  useMemo,
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
} from 'react';
import {View, StyleSheet, Pressable, Dimensions} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import 'react-native-gesture-handler';

function ScreenOne({navigation, setBottomSheetHeight}) {
  const isFocused = useRef(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', e => {
      if (isFocused.current) {
        setBottomSheetHeight(400);
      }
    });

    return unsubscribe;
  }, [navigation, setBottomSheetHeight]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      isFocused.current = true;
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', e => {
      isFocused.current = false;
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setBottomSheetHeight(400);
    }, [setBottomSheetHeight]),
  );

  return (
    <Pressable
      style={{backgroundColor: 'green', height: 400}}
      onPress={() => {
        navigation.navigate('Screen Two');
      }}
    />
  );
}

function ScreenTwo({navigation, setBottomSheetHeight}) {
  useLayoutEffect(() => {
    setBottomSheetHeight(100);
  }, [setBottomSheetHeight]);

  return (
    <Pressable
      style={{backgroundColor: 'pink', flex: 1}}
      onPress={() => {
        navigation.navigate('Screen One');
      }}
    />
  );
}

const Stack = createNativeStackNavigator();
const {height: SCREEN_HEIGHT} = Dimensions.get('screen');

export default function App() {
  const height = useSharedValue(0);
  const top = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {height: height.value, top: top.value};
  });

  const setHeight = value => {
    height.value = withTiming(value);
    top.value = withTiming(SCREEN_HEIGHT - value);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.sheet, animatedStyle]}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{stackAnimation: 'simple_push'}}
            initialRouteName="Screen One">
            <Stack.Screen name="Screen One">
              {screenProps => {
                return (
                  <ScreenOne
                    {...screenProps}
                    setBottomSheetHeight={setHeight}
                  />
                );
              }}
            </Stack.Screen>
            <Stack.Screen name="Screen Two">
              {screenProps => {
                return (
                  <ScreenTwo
                    {...screenProps}
                    setBottomSheetHeight={setHeight}
                  />
                );
              }}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  sheet: {
    position: 'absolute',
    width: '100%',
  },
});
