// components/CustomDrawer.js
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, PanResponder, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router'; // Import the router from expo-router
import MenuIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.7; // Adjust drawer width as needed
const TOP_SPACE = 50; // Adjust top space as needed

const drawerItems = [
    {
        label: 'Profile',
        icon: 'person',
        path: '/(main)/profile',
        items: [],
    },
    {
        label: 'Tasks Report',
        icon: 'report',
        items: [
            { label: 'Monthly Report', icon: 'insert-drive-file', path: '/complaint-register' },
            { label: 'Yearly Report', icon: 'folder-shared', path: '/complaint-track' },
            // { label: 'Finished Complaint', icon: 'check', path: '/finished-complaint' },
        ],
    },
    {
        label: 'Logout',
        icon: 'exit-to-app',
        path: '/(main)/logout',
        items: [],
    },
];

const CustomDrawer = ({ isOpen, closeDrawer }: { isOpen: any, closeDrawer: any }) => {
    const [activeItem, setActiveItem] = useState(null);
    const [activeSubItem, setActiveSubItem] = useState(null);
    const translateX = useRef(new Animated.Value(width)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > 20;
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dx < 0) {
                    translateX.setValue(width + gestureState.dx);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx < -DRAWER_WIDTH / 2) {
                    closeDrawer();
                } else {
                    Animated.spring(translateX, {
                        toValue: width,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    React.useEffect(() => {
        if (isOpen) {
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(translateX, {
                toValue: width,
                useNativeDriver: true,
            }).start();
        }
    }, [isOpen]);

    const handleItemPress = (item: any) => {
        setActiveItem(item.label);
        if (item.items.length === 0) {
            router.push({ pathname: item.path }); // Navigate to the item's path
            closeDrawer();
        }
    };

    const handleSubItemPress = (subItem: any) => {
        setActiveSubItem(subItem.label);
        router.push({ pathname: subItem.path }); // Navigate to the sub-item's path
        closeDrawer();
    };

    return (
        <Animated.View
            style={[styles.drawer, { transform: [{ translateX }] }]}
            {...panResponder.panHandlers}
        >
            <View style={styles.drawerContent}>
                {/* <TouchableOpacity onPress={closeDrawer} style={{ display: "flex", flexDirection: "row" }}>
                    <MenuIcon name='close-circle-outline' size={25} color="black" />
                    <Text style={styles.closeButton}>Close Drawer</Text>
                </TouchableOpacity> */}
                {drawerItems.map((item, index) => (
                    <View key={index}>
                        <TouchableOpacity
                            style={[
                                styles.drawerItem,
                                activeItem === item.label && styles.activeDrawerItem,
                            ]}
                            onPress={() => handleItemPress(item)}
                        >
                            <Icon
                                name={activeItem === item.label && item.items.length > 0 ? 'expand-less' : item.icon}
                                size={24}
                                color={activeItem === item.label ? '#fff' : 'black'}
                                style={styles.icon}
                            />
                            <Text
                                style={[
                                    styles.drawerItemText,
                                    activeItem === item.label && styles.activeDrawerItemText,
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                        {activeItem === item.label &&
                            item.items.length > 0 &&
                            item.items.map((subItem, subIndex) => (
                                <TouchableOpacity
                                    key={subIndex}
                                    style={[
                                        styles.subDrawerItem,
                                        activeSubItem === subItem.label && styles.activeDrawerItem,
                                    ]}
                                    onPress={() => handleSubItemPress(subItem)}
                                >
                                    <Icon
                                        name={subItem.icon}
                                        size={20}
                                        color={activeSubItem === subItem.label ? '#00796b' : 'black'}
                                        style={styles.icon}
                                    />
                                    <Text
                                        style={[
                                            styles.subDrawerItemText,
                                            activeSubItem === subItem.label && styles.activeDrawerItemText,
                                        ]}
                                    >
                                        {subItem.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    drawer: {
        position: 'absolute',
        right: 0,
        top: TOP_SPACE,
        width: DRAWER_WIDTH,
        height: height - TOP_SPACE, // Take full height of the screen minus top space
        backgroundColor: '#93B1A6',
        borderTopLeftRadius: 5,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    drawerContent: {
        flex: 1,
        paddingTop: 20, // Adjust top padding inside drawer as needed
        paddingHorizontal: 20,
    },
    closeButton: {
        fontSize: 18,
        marginBottom: 20,
        marginLeft: 10
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 18,
        padding: 5,
        marginVertical: 10,
    },
    activeDrawerItem: {
        backgroundColor: '#5C8374',
        borderRadius: 5
    },
    drawerItemText: {
        fontSize: 15,
        marginLeft: 10,
    },
    activeDrawerItemText: {
        color: '#fff',
    },
    subDrawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 16,
        padding: 5,
        marginVertical: 5,
        paddingLeft: 20, // Indent sub-items
    },
    subDrawerItemText: {
        fontSize: 16,
        marginLeft: 10,
    },
    icon: {
        width: 24,
        height: 24,
    },
});

export default CustomDrawer;
