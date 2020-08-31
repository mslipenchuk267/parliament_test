import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as userActions from '../store/actions/user';

const HomeScreen = () => {
    const infectionStatus = useSelector(state => state.user.infectionStatus);
    const dispatch = useDispatch();
    console.log("HomeScreen.js - Infection Status: " + infectionStatus)

    const handleSetInfected = () => {
        dispatch(userActions.setInfected());
    }

    const handleSetUninfected = () => {
        dispatch(userActions.setUninfected());
    }

    const handleSetExposed = () => {
        dispatch(userActions.setExposed());
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Parliament</Text>
                <Text style={styles.bodyText}>Anonymous Contact Tracing</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.bodyText}>User ID: [UUID]</Text>
                <Text style={styles.bodyText}>User Status: {infectionStatus}</Text>
            </View>
            <View>
                <Button title="Set Status to Infected" onPress={handleSetInfected}/>
                <Button title="Set Status to Uninfected" onPress={handleSetUninfected}/>
                <Button title="Set Status to Exposed" onPress={handleSetExposed} />
                <Button title="Scan Devices" />
            </View>
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        paddingBottom: '10%',
        alignItems: 'center'
    },
    textContainer: {
        paddingBottom: '5%',
        alignItems: 'center',
    },
    titleText: {
        fontFamily: "Helvetica",
        fontWeight: "bold",
        fontSize: 32
    },
    bodyText: {
        fontFamily: "Helvetica",
        fontSize: 16
    }
});
