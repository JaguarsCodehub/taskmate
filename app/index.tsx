import { supabase } from '@/utils/supabase'
import { Link, router, Stack } from 'expo-router'
import { useEffect } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'


const Home = () => {

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ statusBarColor: "#677D6A" }} />
            <View style={{ padding: 20, display: "flex", flexDirection: "row", marginTop: 20 }}>
                <Image source={require("@/assets/images/swift.png")} style={styles.logoImage} />
                <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 10, fontFamily: "MontserratMedium" }}>Rangshalakaa</Text>
            </View>
            <View style={{ padding: 30 }}>
                <Text style={{ fontSize: 40, color: "#ffe7c3", fontWeight: "600", lineHeight: 50, fontFamily: "MontserratMedium" }}>Get ready to <Text style={{ fontSize: 40, color: "#212121", fontWeight: "600", lineHeight: 50 }}>supercharge your goal</Text> setting and planner with <Text style={{ fontSize: 35, fontWeight: "600" }}>Rangshalakaa</Text></Text>
            </View>
            <View style={{ marginTop: 40, padding: 20 }}>
                <TouchableOpacity onPress={() => router.push('/(auth)')} style={{ backgroundColor: "#212121", borderRadius: 10, paddingHorizontal: 40, paddingVertical: 15 }}>
                    <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontFamily: "MontserratMedium" }}>Get Started Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: 20,
        backgroundColor: "#677D6A"
    },
    logoImage: {
        width: 25,
        height: 25,
    },
    textlogoImage: {
        width: 30,
        height: 30,
        marginRight: 10
    }
})