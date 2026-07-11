import {useEffect, useState, type JSX} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Image,
  View,
  Alert,
} from 'react-native';

import NativeLocalStorage from './specs/NativeLocalStorage';
import NativeDocumentScanner from './specs/NativeDocumentScanner';

const EMPTY = '<empty>';

function App(): JSX.Element {
  const [value, setValue] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [scannedUri, setScannedUri] = useState<string | null>(null);

  useEffect(() => {
    const storedValue = NativeLocalStorage?.getItem('myKey');
    setValue(storedValue ?? '');
  }, []);

  function saveValue() {
    NativeLocalStorage?.setItem(editingValue ?? EMPTY, 'myKey');
    setValue(editingValue);
  }

  function clearAll() {
    NativeLocalStorage?.clear();
    setValue('');
  }

  function deleteValue() {
    NativeLocalStorage?.removeItem('myKey');
    setValue('');
  }

  async function handleScanDocument() {
    try {
      const uri = await NativeDocumentScanner?.scanDocument(1);
      if (uri) {
        setScannedUri(uri);
      }
    } catch (error: any) {
      Alert.alert('Scan Error', error.message);
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.heading}>Local Storage</Text>
      <Text style={styles.text}>
        Current stored value is: {value ?? 'No Value'}
      </Text>
      <TextInput
        placeholder="Enter the text you want to store"
        style={styles.textInput}
        onChangeText={setEditingValue}
      />
      <Button title="Save" onPress={saveValue} />
      <Button title="Delete" onPress={deleteValue} />
      <Button title="Clear" onPress={clearAll} />

      <View style={styles.divider} />

      <Text style={styles.heading}>Document Scanner</Text>
      <Button title="Scan Document" onPress={handleScanDocument} />
      {scannedUri && (
        <Image source={{uri: scannedUri}} style={styles.scannedImage} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heading: {
    margin: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  text: {
    margin: 10,
    fontSize: 20,
  },
  textInput: {
    margin: 10,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 15,
    marginHorizontal: 10,
  },
  scannedImage: {
    width: '90%',
    height: 300,
    alignSelf: 'center',
    marginTop: 10,
    resizeMode: 'contain',
    borderRadius: 8,
  },
});

export default App;
