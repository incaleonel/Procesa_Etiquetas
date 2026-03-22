import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function InstructionsScreen({ onContinue }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Control de Materiales</Text>
      
      <View style={styles.card}>
        <Text style={styles.subtitle}>Instrucciones de uso:</Text>
        
        <View style={styles.bullet}>
          <Text style={styles.bulletText}>• Localice la etiqueta de cabecera o de material[cite: 54, 80].</Text>
        </View>
        <View style={styles.bullet}>
          <Text style={styles.bulletText}>• Asegúrese de que el código de barras esté dentro del marco verde.</Text>
        </View>
        <View style={styles.bullet}>
          <Text style={styles.bulletText}>• El sistema validará vencimientos y cantidades automáticamente[cite: 16, 55].</Text>
        </View>
        
        <Text style={styles.note}>
          Nota: El proceso de lectura por IA toma aprox. 5 segundos[cite: 56].
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>CONTINUAR A LA CÁMARA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#003366', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 3, marginBottom: 30 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  bullet: { marginVertical: 5 },
  bulletText: { fontSize: 16, color: '#333' },
  note: { marginTop: 20, fontSize: 14, color: '#666', fontStyle: 'italic' },
  button: { backgroundColor: '#003366', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});