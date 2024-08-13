import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

const imagesData = [
    {
        id: 1,
        source: require('../../assets/images/avatar1.jpg'),
    },
    {
        id: 2,
        source: require('../../assets/images/avatar2.jpg'),
    },
    {
        id: 3,
        source: require('../../assets/images/avatar3.jpg'),
    },
    {
        id: 4,
        source: require('../../assets/images/avatar4.jpg'),
    },
]

const Main = () => {
    return (
        <View style={{ padding: 20, flex: 1 }}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
                <Image source={require("@/assets/images/swift.png")} style={styles.logoImage} />
                <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 10, fontFamily: "MontserratMedium" }}>TaskMate</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 30, fontFamily: "MontserratSemibold", color: "#1A3636" }}>Start your Day</Text>
                <Text style={{ fontSize: 30, fontFamily: "MontserratMedium" }}>& Be Productive</Text>
            </View>
            <View style={{ backgroundColor: "#93B1A6", paddingVertical: 20, marginTop: 20, borderRadius: 10 }}>
                <View style={{ display: "flex", flexDirection: "row", backgroundColor: "wwhite", paddingHorizontal: 10 }}>
                    {imagesData.map((image) => (
                        <View key={image.id}>
                            <Image source={image.source} style={styles.avatarImage} />
                        </View>
                    ))}
                    <View style={{ backgroundColor: "black", alignItems: "center", justifyContent: "center", borderRadius: 25, padding: 8, marginLeft: 5 }}>
                        <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold", color: "white" }}>10+</Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                    <Text style={{ fontSize: 15, fontFamily: "MontserratSemibold" }}>You have a lot of tasks pending</Text>
                </View>
            </View>
            <View style={{ marginTop: 10 }}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 15, fontFamily: "MontserratSemibold" }}>Today's Task</Text>
                    <Text style={{ fontSize: 15, fontFamily: "MontserratSemibold" }}>See all</Text>
                </View>
            </View>
            <View className='p-6'>
                <TouchableOpacity onPress={() => router.push('/(admin)')}>
                    <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold", color: "white", backgroundColor: "black", padding: 6 }}>Get Started Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Main

const styles = StyleSheet.create({
    logoImage: {
        width: 25,
        height: 25,
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 5
    }
})