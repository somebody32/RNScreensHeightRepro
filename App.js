import React, {
  useMemo,
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import BottomSheet from '@gorhom/bottom-sheet';
import 'react-native-gesture-handler';
function ScreenOne({navigation, setBottomSheetHeight}) {
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

export default function App() {
  const [height, setHeight] = useState(0);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [0, height], [height]);

  return (
    <View style={styles.container}>
      <BottomSheet
        animateOnMount
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{stackAnimation: 'simple_push'}}>
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
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
