import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreditSummaryScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>Create Tasks</Text>
                    {/* <Text style={styles.value}>100%</Text> */}
                    <View style={[styles.impactTag, { backgroundColor: 'green' }]}>
                        <Text style={styles.impactText}>High impact</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Update Tasks</Text>
                    {/* <Text style={styles.value}>2%</Text> */}
                    <View style={[styles.impactTag, { backgroundColor: 'green' }]}>
                        <Text style={styles.impactText}>High impact</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Assign tasks</Text>
                    {/* <Text style={styles.value}>7yrs</Text> */}
                    <View style={[styles.impactTag, { backgroundColor: 'orange' }]}>
                        <Text style={styles.impactText}>Medium impact</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Add Projects</Text>
                    {/* <Text style={styles.value}>28</Text> */}
                    <View style={[styles.impactTag, { backgroundColor: 'red' }]}>
                        <Text style={styles.impactText}>Low impact</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: '#f0f4f8',
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 5,
        marginBottom: 20,
        borderColor: "black",
        borderWidth: 2
        // elevation: 3, // for shadow in Android
        // shadowColor: '#000', // for shadow in iOS
        // shadowOpacity: 0.1,
        // shadowRadius: 10,
        // shadowOffset: { width: 0, height: 5 },
    },
    title: {
        fontSize: 18,
        // fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: "MontserratSemibold"
    },
    value: {
        fontSize: 20,
        // fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: "MontserratSemibold"

    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
        fontFamily: "MontserratSemibold"

    },
    impactTag: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    impactText: {
        color: 'white',
        fontSize: 14,
    },
});

export default CreditSummaryScreen;
