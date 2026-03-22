import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
// IMPORTAMOS EL COMPONENTE AQUÍ:
import InstructionsScreen from './components/InstructionsScreen';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [screen, setScreen] = useState('instructions'); // 'instructions' o 'camera'
  const cameraRef = useRef(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return <InstructionsScreen onContinue={requestPermission} />;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      console.log("Foto capturada:", photo.uri);
      // Aquí irá la lógica para enviar a tu API de IA [cite: 28, 122]
    }
  };

  return (
    <View style={styles.container}>
      {screen === 'instructions' ? (
        <InstructionsScreen onContinue={() => setScreen('camera')} />
      ) : (
        <CameraView style={styles.camera} ref={cameraRef}>
          {/* MARCO TIPO DNI */}
          <View style={styles.overlay}>
            <View style={styles.topMask} />
            <View style={styles.centerRow}>
              <View style={styles.sideMask} />
              <View style={styles.focusedFrame} />
              <View style={styles.sideMask} />
            </View>
            <View style={styles.bottomMask}>
              <Text style={styles.guideText}>Encuadre la etiqueta aquí</Text>
              <TouchableOpacity style={styles.captureBtn} onPress={takePicture} />
              <TouchableOpacity onPress={() => setScreen('instructions')}>
                <Text style={{color: 'white', marginTop: 10}}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: { flex: 1 },
  topMask: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  centerRow: { flexDirection: 'row', height: 200 },
  sideMask: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  focusedFrame: { width: 300, borderWidth: 2, borderColor: '#00FF00', borderRadius: 10 },
  bottomMask: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', paddingTop: 20 },
  guideText: { color: 'white', fontSize: 16, marginBottom: 20 },
  captureBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white' }
});