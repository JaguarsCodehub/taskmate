import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

const PMMeetingComponent = () => {
    const participants = [
        { id: '1', image: require('../assets/images/avatar1.jpg') }, // replace with actual paths to images
        { id: '2', image: require('../assets/images/avatar2.jpg') },
        { id: '3', image: require('../assets/images/avatar3.jpg') },
        { id: '4', image: require('../assets/images/avatar4.jpg') },
    ];

    const date = new Date().getDate()

    return (
        <View style={styles.container}>

            <Text style={styles.title}>User base</Text>
            <Text style={styles.description}>Discussion of tasks for the month</Text>
            <View style={styles.participantsContainer}>
                <FlatList
                    data={participants}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Image source={item.image} style={styles.avatar} />
                    )}
                />
                <View style={styles.extraParticipants}>
                    <Text style={styles.extraParticipantsText}>+7</Text>
                </View>
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>Your Workplace</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#ffefcf',
        // alignItems: 'center',
        borderRadius: 5,
    },
    timeContainer: {
        backgroundColor: '#B99470',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
    },
    timeText: {
        color: 'white',
        fontSize: 16,
        fontFamily: "MontserratSemibold",
    },
    title: {
        fontSize: 24,
        fontFamily: "MontserratSemibold",
        marginBottom: 5,
        color: "#65503b"
    },
    description: {
        color: '#65503b',
        fontSize: 16,
        fontFamily: "MontserratRegular",
        marginBottom: 15,
    },
    participantsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 5,
    },
    extraParticipants: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    extraParticipantsText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    planText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default PMMeetingComponent;
