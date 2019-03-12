import React, { Component } from "react";
import { AuthSession } from "expo";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  Image
} from "react-native";
import jwtDecoder from "jwt-decode";
const auth0ClientId = "MqMExiqhwLb5zC1d6CnWlSVEGsoRWNVR";
const auth0Domain = "https://mcdan.auth0.com";

const toQueryString = params => {
  return (
    "?" +
    Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&")
  );
};

class Auth extends Component {
  state = {
    isLoggedIn: false
  };
  loginWithAuth0 = async () => {
    // get redirect url after login
    const redirectUrl = AuthSession.getRedirectUrl();
    // perform login
    const result = await AuthSession.startAsync({
      authUrl:
        `${auth0Domain}/authorize` +
        toQueryString({
          client_id: auth0ClientId,
          response_type: "id_token",
          scope: "openid profile",
          audience: "https://graphql-tutorials.auth0.com/api/v2/",
          redirect_uri: redirectUrl,
          nonce: "randomstring"
        })
    });
    console.log(result);
    if (result.type === "success") {
      this.handleParams(result.params);
    }
  };

  handleParams = responseObj => {
    if (responseObj.error) {
      Alert.alert(
        "Error",
        responseObj.error_description || "Something went wrong while logging in"
      );
      return;
    }
    // store session in storage and redirect to app
    const encodedToken = responseObj.id_token;
    const decodedToken = jwtDecoder(encodedToken);
    AsyncStorage.setItem(
      "@todo-graphql:auth0",
      JSON.stringify({
        token: encodedToken,
        name: decodedToken.nickname,
        id: decodedToken.sub,
        exp: decodedToken.exp
      })
    ).then(() => {
      this.props.login(decodedToken.sub, decodedToken.nickname, encodedToken);
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.buttonText}
            onPress={this.loginWithAuth0}
          >
            <Text style={styles.buttonText}> Login </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {},
  loginButton: {}
});

export default Auth;
