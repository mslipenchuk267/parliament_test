import React from 'react'
import { StyleSheet, Text, View, Button, PermissionsAndroid } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BleManager } from 'react-native-ble-plx';

import * as userActions from '../store/actions/user';

const HomeScreen = () => {
    const infectionStatus = useSelector(state => state.user.infectionStatus);
    const dispatch = useDispatch();

    const bleManager = new BleManager()

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

    const handleStartDeviceScan = () => {
        bleManager.startDeviceScan(
            null,
            { allowDuplicates: false },
            (error, device) => {
                if (device != null) {
                    console.log("Scanned a device: " + device.name + " " + device.id)
                    //console.log(JSON.stringify(device, getCircularReplacer()));    
                }
            }
        );
    }

    // Use this if we want to parse the device object. 
    //  Need this because the device object is a cyclic structure
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
        };
    };

    const handleStopDeviceScan = () => {
        bleManager.stopDeviceScan();
    }

    // Needs to run once so android can use BLE
    const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: 'Permission Localisation Bluetooth',
            message: 'Requirement for Bluetooth',
            buttonNeutral: 'Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        }
    );

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
                <Button title="Start Device Scan" onPress={handleStartDeviceScan} />
                <Button title="Stop Device Scan" onPress={handleStopDeviceScan} />
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
