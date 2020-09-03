import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, PermissionsAndroid, Platform, FlatList, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BleManager } from 'react-native-ble-plx';

import * as userActions from '../store/actions/user';
import Device from '../models/device';

const HomeScreen = () => {
    const scannedDevices = useSelector(state => state.user.scannedDevices);
    const infectionStatus = useSelector(state => state.user.infectionStatus);
    const dispatch = useDispatch();

    const bleManager = new BleManager();

    //console.log("HomeScreen.js - Infection Status: " + infectionStatus)
    //console.log("HomeScreen.js - Scanned Devices: " + scannedDevices)

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
            async (error, device) =>  {
                if (error) {
                    console.log(error)
                }
                if (device) {
                    // Note that device.id returns the MAC address on Android, and UUID on iOS
                    console.log("Scanned a device: " + device.id)
                    let deviceName = device.name ? device.name : "n/a"
                    //console.log(JSON.stringify(device, getCircularReplacer())); 
                    let newDevice = new Device(device.id, deviceName)
                    dispatch(userActions.addScannedDevice(newDevice));
                    return; // after adding device scan next device.
                }
                
            }
        );
    }

    const handleStartAdvertising = () => {

    }

    const handleStopAdvertising = () => {

    }

    const handleClearScannedDevices = () => {
        dispatch(userActions.clearScannedDevices());
    }

    // Use this if we want to parse the scanned device object. 
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

    // Needs to run once on start so android can use BLE
    useEffect(() => {
        if (Platform.OS === 'android') {
            // (TODO) lets use require variable to be true for device scanning or advertising to execute
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
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Parliament</Text>
                <Text style={styles.bodyText}>Anonymous Contact Tracing</Text>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.bodyText}>User ID: [UUID]</Text>
                <Text style={styles.bodyText}>User Status: {infectionStatus}</Text>
            </View>

            <View style={styles.userStatusButtonContainer}>
                <View style={styles.userStatusButtons} >
                    <Button title="Infected" onPress={handleSetInfected} />
                </View>
                <View style={styles.userStatusButtons} >
                    <Button title="Uninfected" onPress={handleSetUninfected} />
                </View>
                <View style={styles.userStatusButtons} >
                    <Button title="Exposed" onPress={handleSetExposed} />
                </View>
            </View>

            <View style={styles.bluetoothButtonsContainer}>
                <View>
                    <Text style={styles.bluetoothSectionTitle} >Scanning</Text>
                    <View style={styles.userStatusButtons} >
                        <Button title="Start Device Scan" onPress={handleStartDeviceScan} />
                    </View>
                    <View style={styles.userStatusButtons} >
                        <Button title="Stop Device Scan" onPress={handleStopDeviceScan} />
                    </View>
                </View>
                <View>
                    <Text style={styles.bluetoothSectionTitle} >Advertising</Text>
                    <View style={styles.userStatusButtons} >
                        <Button title="Start Advertising" onPress={handleStartAdvertising} />
                    </View>
                    <View style={styles.userStatusButtons} >
                        <Button title="Stop Advertising" onPress={handleStopAdvertising} />
                    </View>
                </View>
            </View>

            <View style={styles.scannedDevicesHeaderContainer}>
                <Text>Scanned Devices: </Text>
                <Button title="Clear" onPress={handleClearScannedDevices} />
            </View>

            <View style={styles.scannedDevicesContainer}>
                <FlatList
                    data={scannedDevices}
                    legacyImplementation={true}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Text style={styles.scannedDevicesText}>{item.id}</Text>
                    )}
                />
            </View>

        </SafeAreaView>
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
        paddingVertical: '5%',
        alignItems: 'center'
    },
    userStatusButtonContainer: {
        flexDirection: 'row'
    },
    bluetoothButtonsContainer: {
        paddingTop: 5,
        flexDirection: 'row',
    },
    scannedDevicesHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: '3%',
        paddingBottom: '2%',
        justifyContent: 'space-between'
    },
    scannedDevicesContainer: {
        borderColor: 'grey',
        borderWidth: 2,
        borderRadius: 5,
        width: '80%',
        height: '25%',
        alignItems: 'center'
    },
    textContainer: {
        paddingBottom: '5%',
        alignItems: 'center',
    },
    titleText: {
        fontFamily: "Helvetica",
        fontWeight: "bold",
        fontSize: 32,
        color: 'black'
    },
    bodyText: {
        fontFamily: "Helvetica",
        fontSize: 16,
        color: 'black'
    },
    scannedDevicesText: {
        fontFamily: "Helvetica",
        fontSize: 12,
        color: 'black',
        paddingHorizontal: 20,
        paddingVertical: 2
    },
    bluetoothSectionTitle: {
        textAlign: 'center',
        fontFamily: "Helvetica",
        fontSize: 16,
        color: 'black'
    },
    userStatusButtons: {
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    bluetoothButtons: {
        paddingVertical: 5
    }
});
