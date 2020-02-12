import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  Image
} from 'react-native';
import Voice from 'react-native-voice';
import YouTube from 'react-native-youtube'

let apiKey = "AIzaSyB3dhlq4Iu7AvEye1jkSEijkGKlyxwRCQY"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "Click the Mic and Say Something..",
      speechEnded: false,
      videoID: ""
    }
    //Setting callbacks for the process status
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    // Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    // Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  componentWillUnmount() {
    //destroy the process after switching the screen 
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onStartButtonPress = async (e) => {
    // Voice.isAvailable().then(data =>
    // console.log(	data))
    try {
      await Voice.start('en-US')
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  }

  onStopButtonPress = async (e) => {
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.log(e);
    }
  }

  onSpeechPartialResults = e => {
    //Invoked when any results are computed
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      text: e.value[0],
    });
  };

  onSpeechResults = e => {
    this.getAPIData(e.value[e.value.length - 1])
  };

  getAPIData = text => {
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${text}&key=${apiKey}`)
      .then(res => res.json())
      .then(results => {
        if (results && results?.items?.length && results.items[0].id.videoId) {
          this.setState({
            speechEnded: true,
            videoID: results.items[0].id.videoId
          })
        } else {
          this.setState({
            text: "No results found",
          })
        }
      })
  }

  onSpeechStart = e => {
    this.setState({
      text: "Click the Mic and Say Something..",
      speechEnded: false,
      videoID: ""
    });
  };



  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
        >
          <TouchableHighlight
            onPress={this.onStartButtonPress}
          >
            <Image
              style={{
                width: 150,
                height: 150,
              }}
              source={require('./mike.jpg')}
            />
          </TouchableHighlight>

          {
            this.state.speechEnded ?
              <View>
                <YouTube
                  apiKey="AIzaSyCxVxsC5k46b8I-CLXlF3cZHjpiqP_myVk"
                  videoId={this.state.videoID}   // The YouTube video ID
                  style={{ alignSelf: 'stretch', height: 300 }}
                  resumePlayAndroid={false}
                  play={true}
                />
                <Text
                  style={{
                    color: 'white',
                    // fontSize: 30,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>Getting Video related to {this.state.text}</Text>
              </View>

              : <Text
                style={{
                  color: 'white',
                  fontSize: 30,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >{this.state.text}</Text>
          }
        </SafeAreaView>
      </>
    );
  }
}

export default App;
