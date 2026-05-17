import React, { useRef } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SwipeActions({ children, onDelete, onEdit }) {
    const swipeableRef = useRef(null);

    const handlePress = (callback) => {
        swipeableRef.current?.close();
        callback();
    };

    const renderRightActions = (progress, drag) => (
        <View style={styles.rightActions}>
            <ActionButton icon="hammer" color="#4F46E5" drag={drag} onPress={() => handlePress(onEdit)} range={[-100, -50]} />
            <ActionButton icon="trash-bin-outline" color="#EF4444" drag={drag} onPress={() => handlePress(onDelete)} range={[-50, 0]} />
        </View>
    );

    return (
        <ReanimatedSwipeable ref={swipeableRef} friction={2} rightThreshold={40} renderRightActions={renderRightActions} containerStyle={styles.swipeContainer}>
            {children}
        </ReanimatedSwipeable>
    );
}

const ActionButton = ({ icon, color, drag, onPress, range }) => {
    const style = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(drag.value, range, [1, 0], Extrapolation.CLAMP) }],
        opacity: interpolate(drag.value, range, [1, 0], Extrapolation.CLAMP),
    }));
    return (
        <Pressable style={styles.btn} onPress={onPress}>
            <Reanimated.View style={style}><Icon name={icon} size={24} color={color} /></Reanimated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    swipeContainer: { overflow: 'visible' },
    rightActions: { flexDirection: 'row', width: 100, justifyContent: 'flex-end' },
    btn: { width: 45, justifyContent: 'center', alignItems: 'center',  },
});