import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import Main from "./src/app/Main";
import Auth from "./src/auth/Auth";

export default class App extends React.Component {
  state = {
    isLoggedIn: false,
    userId: null,
    username: null,
    jwt: null,
    loading: false
  };

  login = async (userId, username, token) => {
    await this.setState({
      isLoggedIn: true,
      userId,
      username,
      jwt: token,
      loading: false
    });
    // console.log(this.state);
  };

  logout = async () => {
    await this.setState({ isLoggedIn: false, loading: false });
  };

  async componentDidMount() {
    AsyncStorage.getItem("@todo-graphql:auth0").then(session => {
      if (session) {
        const obj = JSON.parse(session);
        if (obj.exp > Math.floor(new Date().getTime() / 1000)) {
          this.login(obj.id, obj.name, obj.token);
        } else {
          this.logout();
        }
      }
    });
  }
  render() {
    const { isLoggedIn, userId, username, loading, jwt } = this.state;
    if (loading) {
      return (
        <View>
          <Text>Loading...</Text>
          <Text>I am still loading</Text>
        </View>
      );
    }
    if (isLoggedIn) {
      return (
        <Main
          userId={userId}
          username={username}
          token={jwt}
          logout={this.logout}
        />
      );
    } else {
      return <Auth login={this.login} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
