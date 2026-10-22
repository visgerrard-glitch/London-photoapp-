import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import items from '../locations.json';

export const TASK_NAME = 'LONDON_PHOTO_BACKGROUND_LOCATION';
export const DONE_KEY = 'london-photo-done-v1';
export const ALERTED_KEY = 'london-photo-alerted-v1';
export const RADIUS = 250;
const radians = n => n * Math.PI / 180;
export function distance(a, b) {
  const dLat = radians(b.lat - a.lat), dLon = radians(b.lon - a.lon);
  const q = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q)));
}
// Avoid duplicate notifications, including across relaunches. Only local device storage is used.
let checking = Promise.resolve();
export function checkNearby(coords) {
  checking = checking.catch(() => {}).then(async () => {
    if (!coords || !Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude) || coords.accuracy > 350) return;
    const [doneRaw, alertedRaw] = await Promise.all([AsyncStorage.getItem(DONE_KEY), AsyncStorage.getItem(ALERTED_KEY)]);
    const done = new Set(JSON.parse(doneRaw || '[]'));
    const alerted = new Set(JSON.parse(alertedRaw || '[]'));
    const here = {lat:coords.latitude, lon:coords.longitude};
    for (const item of items) {
      if (done.has(item.id) || alerted.has(item.id) || distance(here, item) > RADIUS) continue;
      alerted.add(item.id);
      // Save BEFORE sending to prevent a second task invocation producing the same alert.
      await AsyncStorage.setItem(ALERTED_KEY, JSON.stringify([...alerted]));
      await Notifications.scheduleNotificationAsync({
        content:{title:'📸 '+item.name, body:item.challenge, data:{id:item.id}, sound:'default'},
        trigger:null
      });
    }
  });
  return checking;
}
TaskManager.defineTask(TASK_NAME, async ({data, error}) => {
  if (error || !data?.locations) return;
  for (const position of data.locations) await checkNearby(position.coords);
});
