import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, PermissionsAndroid, Platform, FlatList, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BleManager } from 'react-native-ble-plx';
import BLEPeripheral from 'react-native-ble-peripheral';
import BLEPeripheraliOS from 'react-native-peripheral';
import * as userActions from '../store/actions/user';
import Device from '../models/device';

// must not create this in a component!
//  if you do the iOS bluetooth behaves really weird
//   - Bluetooth radio will randomly stop scanning
const bleManager = new BleManager();




const HomeScreen = () => {
    const scannedDevices = useSelector(state => state.user.scannedDevices);
    const infectionStatus = useSelector(state => state.user.infectionStatus);
    const dispatch = useDispatch();

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

    const handleStartDeviceScan = async () => {
        bleManager.startDeviceScan(
            null,
            { allowDuplicates: true }, // set this to true because we are keeping track of duplicates ourselves
            async (error, device) => {
                if (error) {
                    console.log(error)
                } else {
                    // Note that device.id returns the MAC address on Android, and UUID on iOS
                    console.log("HomeScreen.js/handleStartDeviceScan()/bleManager.startDeviceScan() - Scanned a device: " + device.id)
                    let deviceName = device.name ? device.name : "n/a"
                    //console.log(JSON.stringify(device, getCircularReplacer())); 
                    let newDevice = new Device(device.id, deviceName)
                    await dispatch(userActions.addScannedDevice(newDevice));
                    return; // after adding device scan next device.
                }
                return;
            }
        );
    }

    const handleStopDeviceScan = () => {
        bleManager.stopDeviceScan();
    }

    const handleStartAdvertising = () => {
        if (Platform.OS === 'android') {
            // this check helps prevent multiple 
            //  advertisement beacons being created for the same device
            if (BLEPeripheral.isAdvertising()) {
                BLEPeripheral.stop()
            }
            //BLEPeripheral.addService('047bc1be-b2b6-46bc-8c97-1f1ea52a30ca', true) //for primary service
            //BLEPeripheral.addCharacteristicToService('047bc1be-b2b6-46bc-8c97-1f1ea52a30ca', 'a5f00b05-00ad-429d-9fd1-2d8e0cc45d0c', 16 | 1, 8) //this is a Characteristic with read and write permissions and notify property
            BLEPeripheral.setName('RNBLETEST')

            BLEPeripheral.start()
                .then(res => {
                    console.log(res)
                }).catch(error => {
                    console.log(error)
                })
        } else {
            if (!BLEPeripheraliOS.isAdvertising()) {
                BLEPeripheraliOS.startAdvertising({
                    name: 'My BLE device',
                });
            }
        }
    }

    const handleStopAdvertising = () => {
        if (Platform.OS === 'android') {
            BLEPeripheral.stop()
        } else {
            if (BLEPeripheraliOS.isAdvertising()) {
                BLEPeripheraliOS.stopAdvertising();
            }
        }
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
                        <Text style={styles.scannedDevicesText}>{item.name}{" "}{item.id}</Text>
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
