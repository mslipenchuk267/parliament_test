import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';

const HomeStackNavigator = createStackNavigator();

export const HomeNavigator = () => {
    return (
        <HomeStackNavigator.Navigator>
            <HomeStackNavigator.Screen 
                name="Home"
                component = {HomeScreen}
            />
        </HomeStackNavigator.Navigator>
    )
}