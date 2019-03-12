import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import createApolloClient from "./apollo";
import gql from "graphql-tag";
import { ApolloProvider } from "react-apollo";
import TodoList from "./TodoList";
import CreateTodo from "./CreateTodo";

const GET_USER = gql`
  query User($id: String!) {
    users_by_pk(id: $id) {
      id
      name
    }
  }
`;

export default class Main extends React.Component {
  state = {
    client: null
  };
  async componentDidMount() {
    const client = await createApolloClient(this.props.token);
    console.log(this.props);

    try {
      // Check if user exist
      const { data } = await client.query({
        query: GET_USER,
        variables: { id: this.props.userId }
      });
      if (data.users_by_pk.id) {
        console.log("User exists already");
      } else {
        await client.mutate({
          mutation: gql`
            mutation($username: String, $userid: String) {
              insert_users(objects: [{ name: $username, id: $userid }]) {
                affected_rows
              }
            }
          `,
          variables: {
            username: this.props.username,
            userid: this.props.userId
          }
        });
      }
    } catch (err) {
      console.log("An error occurred: ", err);
    }

    await this.setState({
      client
    });
    // this.props.logout();
  }
  render() {
    if (!this.state.client) {
      return (
        <View>
          <Text>Logged In...</Text>
        </View>
      );
    }
    return (
      <ApolloProvider client={this.state.client}>
        <Text>McDan Todo App</Text>
        <CreateTodo
          userId={this.props.userId}
          username={this.props.username}
          logout={this.props.logout}
        />
        <TodoList
          userId={this.props.userId}
          username={this.props.username}
          logout={this.props.logout}
        />
      </ApolloProvider>
    );
  }
}
