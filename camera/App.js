import { Camera, CameraType} from 'expo-camera';
import {useState} from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons'
import * as Sharing from 'expo-sharing';


export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(null)

  if (!permission){
    return <View />
  }

  if (!permission.granted){
    return(
      <View style={styles.container}>
        <Text style={{ textAling: 'center'}}>Precisamos de sua permissão para mostrar a Câmera</Text>
        <Button onPress={requestPermission} title="grant permission"/>
      </View>
    );
  }

  function toggleCameraType(){
    setType(current => (current == CameraType.back ? CameraType.front : CameraType.back));
  }

  async function sharePhoto() {
    if (!photo){
      alert('Tire uma foto antes de compartilhar.')
      return;
    }

    if(!(await Sharing.isAvailableAsync())){
      alert('Uh ja podes compartilhar la fueto');
      return;
    }

    await Sharing.shareAsync(photo);
  }

  return (
  <View style={styles.container}>
    <Camera style={styles.camera} type={type} ref={ref => {setCameraRef(ref);}}>

      <View style={styles.rodape}>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <View style={styles.buttonBackground}>
            <Entypo
              name="cw"
              size={35}
              color="black"
            />
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          if(cameraRef){
            let photo = await cameraRef.takePictureAsync();
            console.log('photo', photo);
            setPhoto(photo.uri);
          }}}>
            <View style={styles.buttonBackground} >
              <Entypo
                name="camera"
                size={35}
                color="black"
              />
            </View>
      </TouchableOpacity>

      {photo && <View>
            <TouchableOpacity
              style={styles.button}
              onPress={sharePhoto}>
                <View style={styles.buttonBackground}>
                  <Entypo
                    name="share"
                    size={35}
                    color="black"
                  />
                </View>
            </TouchableOpacity>
          </View>}
      </View>{/*rodape*/}
    </Camera>
    {photo && <Image source={{ uri: photo }} style={{ width:200, height: 200}}/>}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 5,
    background: 'transparent',
    marginTop: -80,
    flexDirection:'row',
    gap: 10,
    display: 'flex',
  },

  button: {
    flex: 1,
    justifyContent: 'start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
    marginLeft: -90,
  },
  rodape:{
    position: 'absolute',
    top: '80%',
    left: '30%',
    width: '50%',
    marginBottom: 35,
    background: 'transparent',
  },
  buttonBackground:{
    backgroundColor: '#FFFF', 
    borderRadius: 15,
    alignItems: 'center',
    width: '17%',
  }
});
