import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null); // Para ver el recorte
  const cameraRef = useRef(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Necesitamos permiso para la cámara</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Dar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !loading) {
      setLoading(true);
      try {
        // 1. Captura la foto original
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });

        // 2. Calculamos el recorte central (70% ancho, 30% alto)
        // Esto debería coincidir con tu recuadro visual
        const cropWidth = photo.width * 0.7;
        const cropHeight = photo.height * 0.3;
        const originX = (photo.width - cropWidth) / 2;
        const originY = (photo.height - cropHeight) / 2;

        // 3. Procesamos: Recortar + Redimensionar a 800px (Clave para velocidad)
        const manipulated = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            { 
              crop: { 
                originX: originX, 
                originY: originY, 
                width: cropWidth, 
                height: cropHeight 
              } 
            },
            { resize: { width: 800 } } 
          ],
          { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        // 4. Mostramos la miniatura en pantalla para auditar
        setPhotoPreview(manipulated.uri);

        // 5. Envío a Skyone
        const response = await fetch('https://magic.api.integrasky.cloud/skyone-generatica/v1/validar-etiqueta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: manipulated.base64 // Enviamos solo el recorte
          }),
        });

        const result = await response.json();
        console.log("Respuesta de la IA:", result);
        Alert.alert("Resultado", JSON.stringify(result));

      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo procesar la imagen.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        
        {/* Guía visual para el usuario */}
        <View style={styles.overlay}>
          <View style={styles.focusedFrame} />
        </View>

        {/* Miniatura de lo que ve la IA (Debug) */}
        {photoPreview && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewText}>LO QUE VE LA IA:</Text>
            <Image source={{ uri: photoPreview }} style={styles.previewImage} />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>ESCANEAR ETIQUETA</Text>}
          </TouchableOpacity>
        </View>

      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedFrame: {
    width: '80%',
    height: '30%',
    borderWidth: 2,
    borderColor: '#00FF00', // Marco verde
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
  },
  text: { color: 'white', fontWeight: 'bold' },
  previewContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: 'black'
  },
  previewText: { color: 'white', fontSize: 10, textAlign: 'center' },
  previewImage: { width: 150, height: 75, resizeMode: 'contain' }
});