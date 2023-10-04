/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-reanimated'

import {AppRegistry} from 'react-native';
import MainNavigator from './src/navigators/MainNavigator';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => MainNavigator);
