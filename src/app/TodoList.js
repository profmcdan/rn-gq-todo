import React, { Component } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Platform,
  Picker
} from "react-native";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import TodoItem from "./TodoItem";
import createApolloClient from "./apollo";

const isAndroid = Platform.OS == "android";
const viewPadding = 10;
const FETCH_TODOS = gql`
  query {
    todos {
      id
      text
      is_completed
    }
  }
`;

const Todos = ({ onSelectedTodo }) => {
  <Query query={FETCH_TODOS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <select name="todo" onChange={onSelectedTodo}>
            {data.todos.map(todo => (
              <option key={todo.id} value={todo.id}>
                {dog.text}
              </option>
            ))}
          </select>
        </ScrollView>
      );
    }}
  </Query>;
};

{
  /* <FlatList
                data={data.todos}
                renderItem={({ item }) => <TodoItem todo={item} />}
                keyExtractor={item => item.id.toString()}
              /> */
}

class TodoList extends Component {
  state = {};
  _keyExtractor = (item, index) => item.id;
  async componentDidMount() {
    const client = await createApolloClient(this.props.token);

    try {
      const { data } = await client.query({
        query: FETCH_TODOS
      });
      await this.setState({ todos: data.todos });
      console.log(this.state.todos);
    } catch (err) {
      console.log("An error occurred: ", err);
    }
  }

  onSelectedTodo = () => {};
  render() {
    const { todos } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* <FlatList
          data={todos}
          renderItem={({ item }) => <TodoItem todo={item} />}
          keyExtractor={this._keyExtractor}
        /> */}
        <FlatList
          data={todos}
          renderItem={({ item }) => <Text>{item.text}</Text>}
          keyExtractor={this._keyExtractor}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: viewPadding,
    paddingTop: 20
  },
  list: {
    width: "100%"
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 18
  },
  hr: {
    height: 1,
    backgroundColor: "gray"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "gray",
    borderWidth: isAndroid ? 0 : 1,
    width: "100%"
  },
  contentContainer: {
    paddingVertical: 20
  }
});

export default TodoList;
