import { Link, router, Stack } from 'expo-router'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'


const Home = () => {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ statusBarColor: "#677D6A" }} />
            <View style={{ padding: 20, display: "flex", flexDirection: "row", marginTop: 20 }}>
                <Image source={require("@/assets/images/swift.png")} style={styles.logoImage} />
                <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 10 }}>TaskMate</Text>
            </View>
            <View style={{ padding: 30 }}>
                <Text style={{ fontSize: 50, color: "#ffe7c3", fontWeight: "600", lineHeight: 50 }}>Get ready to <Text style={{ fontSize: 50, color: "#212121", fontWeight: "600", lineHeight: 50 }}>supercharge your goal</Text> setting and planner with <Text style={{ fontSize: 45, fontWeight: "600" }}>TaskMate</Text></Text>
            </View>
            <View style={{ marginTop: 70, padding: 20 }}>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={{ backgroundColor: "#212121", borderRadius: 10, paddingHorizontal: 40, paddingVertical: 15 }}>
                    <Text style={{ textAlign: "center", color: "white", fontSize: 15 }}>Get Started</Text>
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