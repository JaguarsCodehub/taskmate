import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ReportTasks = ({ taskReport }: any) => {
    return (
        <View>
            <FlatList
                style={{ backgroundColor: "lightgray", borderRadius: 10 }}
                data={taskReport}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                    <View style={styles.reportItem}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={{ fontFamily: "MontserratRegular", marginTop: 10 }}>Assigned By: {item.assigned_by_name}</Text>
                        <Text style={{ fontFamily: "MontserratRegular" }}>Status: {item.status}</Text>
                        <Text style={{ fontFamily: "MontserratRegular" }}>Priority: {item.priority}</Text>
                        <Text style={{ fontFamily: "MontserratRegular" }}>Start Date: {new Date(item.start_date).toLocaleDateString()}</Text>
                        <Text style={{ fontFamily: "MontserratRegular" }}>Due Date: {new Date(item.due_date).toLocaleDateString()}</Text>
                        <Text style={{ fontFamily: "MontserratRegular" }}>Assigned At: {new Date(item.assigned_at).toLocaleDateString()}</Text>
                    </View>
                )}
            />
        </View>
    )
}

export default ReportTasks

const styles = StyleSheet.create({
    reportItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ececec',
    },
    title: {
        fontSize: 18,
        fontFamily: "MontserratSemibold"
    },
})